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
  console.log(order?.user);
  return (
    <div className="my-4 px-7">
      <ul className=" md:columns-2 ">
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Order Id: <span className="font-bold mr-2 w-1/2">{order?.id}</span>{" "}
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Total amount: <span className="font-bold mr-2 w-1/2">{Number(order?.totalAmount)}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Items: <span className="font-bold mr-2 w-1/2">{order?.items.map((item) => item.name).join(", ")}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Customer name: <span className="font-bold mr-2 w-1/2">{order?.fullName}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Delivery type: <span className="font-bold mr-2 w-1/2">{order?.deliveryType}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Status: <span className="font-bold mr-2 w-1/2">{order?.status}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Phone: <span className="font-bold mr-2 w-1/2">{order?.phone}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Email: <span className="font-bold mr-2 w-1/2">{order?.email}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Address: <span className="font-bold mr-2 w-1/2">{order?.address}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Comment: <span className="font-bold mr-2 w-1/2">{order?.comment}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Shipping method: <span className="font-bold mr-2 w-1/2">{order?.shippingMethod}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          City: <span className="font-bold mr-2 w-1/2">{order?.city}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Delivery City: <span className="font-bold mr-2 w-1/2">{order?.deliveryCity}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          Delivery Zip: <span className="font-bold mr-2 w-1/2">{order?.deliveryZip}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Zip: <span className="font-bold mr-2 w-1/2">{order?.zip}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Contact form: <span className="font-bold mr-2 w-1/2">{order?.contactForm}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Delivery full name: <span className="font-bold mr-2 w-1/2">{order?.deliveryFullNmae}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Packstation: <span className="font-bold mr-2 w-1/2">{order?.packstationNumber}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Post number: <span className="font-bold mr-2 w-1/2">{order?.postNumber}{" "}</span>
        </li>
        <li className="break-inside-avoid flex justify-between  px-2 py-1 even:bg-gray-100 odd:bg-white">
          {" "}
          Post office: <span className="font-bold mr-2 w-1/2">{order?.createdAt.toDateString()}{" "}</span>
        </li>
      </ul>
    </div>
  );
}
