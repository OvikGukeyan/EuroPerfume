"use client";
import React, { FC } from "react";
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
import { Button, Select } from "../ui";
import { Trash2 } from "lucide-react";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useOrders } from "@/src/shared/hooks";
import { OrderItemsPopover } from "./order-items-popover";
import { useRouter } from "@/src/i18n/navigation";

type Props = {
  className?: string;
};

export const OrdersTable: FC<Props> = ({ className }) => {
  const { items, removeOrder, changeOrderStatus, loading } = useOrders();
  const router = useRouter();
  return (
    <div className={cn("", className)}>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Customer name</TableHead>
            <TableHead>phone</TableHead>
            <TableHead>contact form</TableHead>
            <TableHead>delivery type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((order) => (
            <TableRow
              onClick={() => router.push(`/order/${order.id}`)}
              key={order.id}
              className={
                (order.status === OrderStatus.PENDING && "bg-yellow-100") ||
                (order.status === OrderStatus.CENCELLED && "bg-red-100") ||
                (order.status === OrderStatus.SUCCEEDED && "bg-green-100") ||
                ""
              }
            >
              <TableCell>
                <div onClick={(e) => e.stopPropagation()}>
                  <OrderItemsPopover order={order} />
                </div>
              </TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              <TableCell>{order.fullName}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.contactForm}</TableCell>
              <TableCell>{order.deliveryType}</TableCell>
              <TableCell>
                <Select
                  onValueChange={(value) => {
                    changeOrderStatus(order.id, value as OrderStatus);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={order.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={OrderStatus.PENDING}>PENDING</SelectItem>
                    <SelectItem value={OrderStatus.SUCCEEDED}>
                      SUCCEEDED
                    </SelectItem>
                    <SelectItem value={OrderStatus.CENCELLED}>
                      CENCELLED
                    </SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell>
                <Button
                  loading={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOrder(order.id);
                  }}
                  variant="outline"
                >
                  <Trash2 size={17} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
