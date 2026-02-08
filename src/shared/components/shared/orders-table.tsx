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
import { Search, Trash2 } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useOrders } from "@/src/shared/hooks";
import { useRouter } from "@/src/i18n/navigation";
import { OrderStatuses } from "@/prisma/constants";
import { AlertDialogButton } from "./alert-dialog-button";
import { convertDate } from "../../lib";

type Props = {
  className?: string;
};

export const OrdersTable: FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { orders, removeOrder, changeOrderStatus, loading } = useOrders();
  const router = useRouter();
  return (
    <div className={cn("", className)}>
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
            <TableHead>Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders
            .filter((order) => order.id.toString().includes(searchQuery))
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
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.contactForm}</TableCell>
                <TableCell>
                  <Select
                    onValueChange={(value) => {
                      changeOrderStatus(order.id, value as OrderStatus);
                    }}
                  >
                    <SelectTrigger onClick={(e) => e.stopPropagation()}>
                      <SelectValue
                        placeholder={
                          OrderStatuses[
                            (order.status as keyof typeof OrderStatuses) ||
                              "NEW"
                          ]
                        }
                      />
                    </SelectTrigger>
                    <SelectContent onClick={(e) => e.stopPropagation()}>
                      <SelectItem value={OrderStatus.PENDING}>
                        В обработке
                      </SelectItem>
                      <SelectItem value={OrderStatus.SUCCEEDED}>
                        Отправлен
                      </SelectItem>
                      <SelectItem value={OrderStatus.CENCELLED}>
                        Отменен
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <AlertDialogButton
                    onClickContinue={() => removeOrder(order.id)}
                    text={
                      "This action cannot be undone. This will permanently delete the order."
                    }
                  >
                    <Trash2 />
                  </AlertDialogButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
