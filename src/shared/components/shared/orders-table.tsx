"use client";
import React, { FC, useState } from "react";
import { cn } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { OrderStatus } from "@prisma/client";
import { Select } from "../ui";
import { Search } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useOrders } from "@/src/shared/hooks";
import { useRouter } from "@/src/i18n/navigation";
import { useLocale } from "use-intl";
import { convertDate } from "../../lib";

type Props = {
  className?: string;
};

export const OrdersTable: FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, removeOrder, changeOrderStatus, loading } = useOrders();
  const router = useRouter();
  const ru = useLocale() === "ru";
  const statusHeading = ru ? "Статус" : "Status";
  const statusLabels = {
    [OrderStatus.NEW]: ru ? "Новый" : "Neu",
    [OrderStatus.PENDING]: ru ? "В обработке" : "In Bearbeitung",
    [OrderStatus.SUCCEEDED]: ru ? "Отправлен" : "Versendet",
    [OrderStatus.CENCELLED]: ru ? "Отменён" : "Storniert",
  };
  return (
    <div className={cn("min-w-0", className)}>
      <div
        className={cn(
          "flex rounded-2xl flex-1 justify-between relative h-12 z-30",
          className
        )}
      >
        <Search className="absolute top-1/2 translate-y-[-50%] left-3 h-5 text-gray-400" />
        <input
          className="rounded-md outline-none w-full bg-gray-100 pl-11"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Имя</TableHead>
            <TableHead>Телефон</TableHead>
            <TableHead>Способ связи</TableHead>
            <TableHead className="w-44 min-w-44 whitespace-nowrap">{statusHeading}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .filter((order) => [order.id.toString(), order.fullName, order.comment || "", order.email, ...(order.promotions||[]).map(p=>p.slug)].some(value => value.toLowerCase().includes(searchQuery.toLowerCase())))
            .map((order) => (
              <TableRow
                onClick={() => router.push(`/order/${order.id}`)}
                key={order.id}
                className={
                  (order.status === OrderStatus.NEW && "bg-blue-300") ||
                  (order.status === OrderStatus.PENDING && "bg-yellow-100") ||
                  (order.status === OrderStatus.CENCELLED && "bg-red-100") ||
                  (order.status === OrderStatus.SUCCEEDED && "bg-green-100") ||
                  ""
                }
              >
                <TableCell>
                  {convertDate(order.createdAt)}
                  {/* <div onClick={(e) => e.stopPropagation()}>
                    <OrderItemsPopover order={order} />
                  </div> */}
                </TableCell>
                <TableCell>{order.totalAmount} </TableCell>
                <TableCell><div className="flex flex-col gap-1"><span>{order.fullName}</span>{(order.promotions||[]).map(p=><span key={p.slug} className="w-fit rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-900">🎁 {p.titleRu} · {p.giftName} {p.giftMl} мл</span>)}</div></TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.contactForm}</TableCell>
                <TableCell className="w-44 min-w-44">
                  <Select
                    value={order.status}
                    onValueChange={(value) => {
                      if(value===OrderStatus.CENCELLED&&!window.confirm("Отменить заявку? Если нет Rechnung и подтверждённой оплаты, зарезервированные баллы и WELCOME10 вернутся покупателю. Действие нельзя отменить."))return;
                      void changeOrderStatus(order.id, value as OrderStatus);
                    }}
                  >
                    <SelectTrigger
                      aria-label={`${statusHeading}: ${statusLabels[order.status]}`}
                      className="gap-2 whitespace-nowrap [&>span]:line-clamp-none [&>svg]:shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SelectValue>{statusLabels[order.status]}</SelectValue>
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value={OrderStatus.PENDING}>{statusLabels[OrderStatus.PENDING]}</SelectItem>
                      <SelectItem value={OrderStatus.SUCCEEDED}>{statusLabels[OrderStatus.SUCCEEDED]}</SelectItem>
                      <SelectItem value={OrderStatus.CENCELLED}>{statusLabels[OrderStatus.CENCELLED]}</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>


              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
