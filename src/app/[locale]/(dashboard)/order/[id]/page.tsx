import { formatMoney } from "@/src/shared/lib/money";
import { readPricing } from "@/src/shared/lib/tax";
import { OrderStatuses } from "@/prisma/constants";
import { prisma } from "@/prisma/prisma-client";
import {
  DhlButton,
  InvoiceButton,
  OrderItemsList,
} from "@/src/shared/components/shared";
import { convertDate } from "@/src/shared/lib";
import { Prisma, ShippingMethods } from "@prisma/client";
import { getLocale, getTranslations } from "next-intl/server";

import { ClubFulfillmentActions } from "@/src/shared/components/shared/club-fulfillment-actions";
import { accountOrderEligible } from "@/src/shared/lib/europerfume-club";
import { orderFulfillmentBlock } from "@/src/shared/lib/order-fulfillment-shortcuts";

export default async function Order({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      // items: {
      //   include: {
      //     variation: true,
      //     product: {
      //       include: {
      //         brand: true,
      //       },
      //     },
      //   },
      // },
      invoice: true,
      user: { select: { verified: true } },
      shipments: true,
    },
  });

  // const safeOrder = {
  //   ...order,
  //   totalAmount: Number(order?.totalAmount),
  // };
  // const date = order?.createdAt;

  const promotions = await prisma.orderPromotion.findMany({where:{orderId:Number(id)}}).catch(()=>[]);
  const gifts=promotions.map(p=>p.snapshot as {slug:string;titleRu:string;giftName:string;giftMl:number});
  const t = await getTranslations("Checkout");
  const snapshot = readPricing(order?.pricingSnapshot);
  const ru = (await getLocale()) === "ru";
  const clubOrder = order && accountOrderEligible(order.userId, order.user?.verified ?? null, order.createdAt)
    ? order
    : null;
  let fulfillmentUnavailable = false;
  const fulfillment = clubOrder ? await prisma.orderFulfillment.findUnique({
    where: { orderId: clubOrder.id },
    select: { paymentConfirmedAt: true, shippedConfirmedAt: true },
  }).catch(error => {
    if (!(error instanceof Prisma.PrismaClientKnownRequestError) || !["P2021", "P2022"].includes(error.code)) throw error;
    fulfillmentUnavailable = true;
    return null;
  }) : null;
  const fulfillmentBlock = clubOrder ? orderFulfillmentBlock({
    cancelled: clubOrder.status === "CENCELLED",
    hasInvoice: Boolean(clubOrder.invoice),
    clubEligible: true,
    awardsEnabled: process.env.EUROPERFUME_CLUB_AWARD_ENABLED === "true",
    hasPricing: Boolean(snapshot),
  }) : null;
  const fulfillmentHint = fulfillmentUnavailable
    ? (ru ? "Подтверждения пока недоступны." : "Bestätigungen sind derzeit nicht verfügbar.")
    : fulfillmentBlock === "ORDER_CANCELLED"
    ? (ru ? "Заказ отменён." : "Bestellung storniert.")
    : fulfillmentBlock === "INVOICE_REQUIRED_BEFORE_LOYALTY_AWARD"
    ? (ru ? "Сначала создай Rechnung." : "Zuerst die Rechnung erstellen.")
    : fulfillmentBlock
    ? (ru ? "Подтверждения по этому заказу пока недоступны." : "Bestätigungen für diese Bestellung sind derzeit nicht verfügbar.")
    : null;
  const breakdown = snapshot && snapshot.totalGrossCents === Math.round(Number(order?.totalAmount) * 100)
    ? [
        ["Товары", snapshot.subtotalGrossCents],
        ...(snapshot.discountGrossCents > 0 ? [["Скидка", -snapshot.discountGrossCents]] as const : []),
        ...((snapshot.loyaltyDiscountCents??0)>0 ? [[order?.invoice?"Списано баллов":"Резерв баллов до Rechnung",-(snapshot.loyaltyDiscountCents??0)]] as const : []),
        ["Доставка", snapshot.shippingGrossCents],
      ] as const
    : [];
  return (
    <div className="my-4 md:px-7">
      <OrderItemsList />
      {gifts.map(p=><section key={p.slug} className="m-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm"><strong>🎁 Акция: {p.titleRu}</strong><p>Подарок: {p.giftName} · {p.giftMl} мл · 0,00 €</p><p className="text-xs">Код: {p.slug}. Вложить при комплектации.</p></section>)}
      <ul className="md:columns-2">
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер заказа:
          <span className="font-bold mr-2 w-1/2">{order?.id}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Общая сумма:
          <span className="font-bold mr-2 w-1/2">
            {formatMoney(Number(order?.totalAmount))} €
          </span>
        </li>

        {breakdown.map(([label, amount]) => (
          <li key={label} className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
            {label}:
            <span className="font-bold mr-2 w-1/2">{formatMoney(amount / 100)} €</span>
          </li>
        ))}

        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Промокод:
          <span className="font-bold mr-2 w-1/2">{order?.promocode}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Имя покупателя:
          <span className="font-bold mr-2 w-1/2">{order?.fullName}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Статус заказа:
          <span className="font-bold mr-2 w-1/2">
            {OrderStatuses[order?.status as keyof typeof OrderStatuses]}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Телефон: <span className="font-bold mr-2 w-1/2">{order?.phone}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Электронная почта:
          <span className="font-bold mr-2 w-1/2">{order?.email}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Почтовый индекс:
          <span className="font-bold mr-2 w-1/2">{order?.zip}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Страна: <span className="font-bold mr-2 w-1/2">{order?.country}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Город: <span className="font-bold mr-2 w-1/2">{order?.city}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Адрес: <span className="font-bold mr-2 w-1/2">{order?.address}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер дома:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.houseNumber}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Комментарий:
          <span className="font-bold mr-2 w-1/2">{order?.comment}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Имя получателя:
          <span className="font-bold mr-2 w-1/2">
            {order?.deliveryFullNmae}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Способ доставки:
          <span className="font-bold mr-2 w-1/2">
            {t(`delivery.${order?.shippingMethod}`)}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Индекс доставки:
          <span className="font-bold mr-2 w-1/2">{order?.deliveryZip}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Страна доставки:
          <span className="font-bold mr-2 w-1/2">{order?.deliveryCountry}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Город доставки:
          <span className="font-bold mr-2 w-1/2">{order?.deliveryCity}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Адрес доставки:
          <span className="font-bold mr-2 w-1/2">{order?.deliveryAddress}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер дома доставки:
          <span className="font-bold mr-2 w-1/2">
            {order?.deliveryHouseNumber}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Форма связи:
          <span className="font-bold mr-2 w-1/2">{order?.contactForm}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер Packstation:
          <span className="font-bold mr-2 w-1/2">
            {order?.packstationNumber}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Почтовый номер:
          <span className="font-bold mr-2 w-1/2">{order?.postNumber}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Дата оформления:
          <span className="font-bold mr-2 w-1/2">
            {convertDate(order?.createdAt as Date)}
          </span>
        </li>
      </ul>
      <div className={`mt-5 grid gap-3 ${clubOrder ? "max-w-3xl lg:grid-cols-2" : "max-w-sm"}`}>
          <DhlButton
            ru={ru}
            orderId={order?.id}
            deliveryFullNmae={order?.deliveryFullNmae || ""}
            addressStreet={order?.deliveryAddress || ""}
            addressHouse={order?.deliveryHouseNumber || ""}
            postalCode={order?.deliveryZip || ""}
            city={order?.deliveryCity || ""}
            country={order?.deliveryCountry || ""}
            email={order?.email || ""}
            labelUrl={order?.shipments[0]?.labelUrl || undefined}
            trackingCode={order?.trackingCode || undefined}
            shippingMethod={
              order?.shippingMethod || ShippingMethods.BILLING_ADDRESS
            }
            postOffice={order?.postOffice || ""}
            packstationNumber={order?.packstationNumber || ""}
            postNumber={order?.postNumber || ""}
            totalPrice={Number(order?.totalAmount) || 0}
          />
        {clubOrder && (
          <section className="flex min-w-0 flex-col gap-3 rounded-lg border bg-white p-4">
            <h2 className="text-sm font-semibold">{ru ? "Оплата и отправка" : "Zahlung und Versand"}</h2>
            <p className="text-xs leading-5 text-neutral-600">
              {ru
                ? "Подтверди, когда оплата получена и посылка передана DHL."
                : "Bestätige den Zahlungseingang und die tatsächliche Übergabe an DHL."}
            </p>
            {fulfillmentHint && <p className="text-xs text-neutral-600">{fulfillmentHint}</p>}
            <div className="mt-auto">
              <ClubFulfillmentActions
                key={clubOrder.id}
                orderId={clubOrder.id}
                paid={Boolean(fulfillment?.paymentConfirmedAt)}
                shipped={Boolean(fulfillment?.shippedConfirmedAt)}
                enabled={!fulfillmentUnavailable && !fulfillmentBlock}
                source="order_details"
              />
            </div>
          </section>
        )}
      </div>
      <div className={`mt-4 rounded-lg border bg-white p-4 ${clubOrder ? "max-w-3xl" : "max-w-sm"}`}>
        <InvoiceButton invoiceUrl={order?.invoice?.pdfUrl || ""} id={order?.id || 0} />
      </div>
    </div>
  );
}
