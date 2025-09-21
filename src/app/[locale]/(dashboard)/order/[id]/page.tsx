import { OrderStatuses } from "@/prisma/constants";
import { prisma } from "@/prisma/prisma-client";
import { getTranslations } from "next-intl/server";

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
      items: {
        include: {
          variation: true,
          product: {
            include: {
              brand: true,
            },
          },
        },
      },
      user: true,
    },
  });
  const date = order?.createdAt;

  const convertedDate = new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Berlin",
  }).format(date);

  const t = await getTranslations("Checkout");
  return (
    <div className="my-4 px-7">
      <ul className="md:columns-2">
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер заказа:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.id}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Общая сумма:{" "}
          <span className="font-bold mr-2 w-1/2">
            {Number(order?.totalAmount)} €
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Товары:{" "}
          <div className="flex flex-col font-bold mr-2 w-1/2">
            {order?.items
              .map(
                item => (
                  <div className="flex justify-between" key={item.id}>
                    <p>{item.product?.brand?.name}</p>
                    <p>{item.name}</p>
                    <p>{item.variation && item.variation.name}</p>
                    <p>{item.quantity}</p>
                  </div>
                )
                  
              )
              }
          </div>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Имя покупателя:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.fullName}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Тип доставки:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.deliveryType}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Статус заказа:{" "}
          <span className="font-bold mr-2 w-1/2">
            {OrderStatuses[order?.status as keyof typeof OrderStatuses]}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Телефон: <span className="font-bold mr-2 w-1/2">{order?.phone}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Электронная почта:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.email}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Почтовый индекс:{" "}
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
          Комментарий:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.comment}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Имя получателя:{" "}
          <span className="font-bold mr-2 w-1/2">
            {order?.deliveryFullNmae}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Способ доставки:{" "}
          <span className="font-bold mr-2 w-1/2">
            {t(`delivery.${order?.shippingMethod}`)}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Индекс доставки:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.deliveryZip}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Страна доставки:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.deliveryCountry}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Город доставки:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.deliveryCity}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Адрес доставки:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.deliveryAddress}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Форма связи:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.contactForm}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Номер Packstation:{" "}
          <span className="font-bold mr-2 w-1/2">
            {order?.packstationNumber}
          </span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Почтовый номер:{" "}
          <span className="font-bold mr-2 w-1/2">{order?.postNumber}</span>
        </li>
        <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
          Дата оформления:{" "}
          <span className="font-bold mr-2 w-1/2">
            {convertedDate}
          </span>
        </li>
      </ul>
    </div>
  );
}
