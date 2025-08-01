import { prisma } from "@/prisma/prisma-client";

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
        },
      },
      user: true,
    },
  });
  return (
   <div className="my-4 px-7">
  <ul className="md:columns-2">
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Номер заказа: <span className="font-bold mr-2 w-1/2">{order?.id}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Общая сумма: <span className="font-bold mr-2 w-1/2">{Number(order?.totalAmount)}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Товары:{" "}
      <span className="font-bold mr-2 w-1/2">
        {order?.items
          .map((item) => item.name + " " + (item.variation ? item.variation?.name : "") + " x " + item.quantity)
          .join(", ")}
      </span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Имя покупателя: <span className="font-bold mr-2 w-1/2">{order?.fullName}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Тип доставки: <span className="font-bold mr-2 w-1/2">{order?.deliveryType}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Статус заказа: <span className="font-bold mr-2 w-1/2">{order?.status}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Телефон: <span className="font-bold mr-2 w-1/2">{order?.phone}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Электронная почта: <span className="font-bold mr-2 w-1/2">{order?.email}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Почтовый индекс: <span className="font-bold mr-2 w-1/2">{order?.zip}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Город: <span className="font-bold mr-2 w-1/2">{order?.city}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Адрес: <span className="font-bold mr-2 w-1/2">{order?.address}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Комментарий: <span className="font-bold mr-2 w-1/2">{order?.comment}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Имя получателя: <span className="font-bold mr-2 w-1/2">{order?.deliveryFullNmae}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Способ доставки: <span className="font-bold mr-2 w-1/2">{order?.shippingMethod}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Индекс доставки: <span className="font-bold mr-2 w-1/2">{order?.deliveryZip}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Город доставки: <span className="font-bold mr-2 w-1/2">{order?.deliveryCity}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Адрес доставки: <span className="font-bold mr-2 w-1/2">{order?.deliveryAddress}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Форма связи: <span className="font-bold mr-2 w-1/2">{order?.contactForm}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Номер Packstation: <span className="font-bold mr-2 w-1/2">{order?.packstationNumber}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Почтовый номер: <span className="font-bold mr-2 w-1/2">{order?.postNumber}</span>
    </li>
    <li className="break-inside-avoid flex justify-between px-2 py-1 even:bg-gray-100 odd:bg-white">
      Дата оформления: <span className="font-bold mr-2 w-1/2">{order?.createdAt.toDateString()}</span>
    </li>
  </ul>
</div>
  );
}
