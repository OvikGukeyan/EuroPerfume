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

type Props = {
  className?: string;
};

export const OrdersTable: FC<Props> = ({ className }) => {
  const { items, removeOrder, changeOrderStatus, loading } = useOrders();

  return (
    <div className={cn("", className)}>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Order Id</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Customer name</TableHead>
            <TableHead>email</TableHead>
            <TableHead>phone</TableHead>
            <TableHead>contact form</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>comment</TableHead>
            <TableHead>address</TableHead>
            <TableHead>delivery type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((order) => (
            <TableRow
              key={order.id}
              className={
                (order.status === OrderStatus.PENDING && "bg-yellow-100") ||
                (order.status === OrderStatus.CENCELLED && "bg-red-100") ||
                (order.status === OrderStatus.SUCCEEDED && "bg-green-100") ||
                ""
              }
            >
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>

                <OrderItemsPopover order={order}/>
                {/* {order.items.map((item) => (
                  <div key={item.id}>
                    {item.name} : {item.quantity}
                  </div>
                ))} */}
              </TableCell>
              <TableCell>{order.totalAmount}</TableCell>
              <TableCell>{order.fullName}</TableCell>
              <TableCell>{order.email}</TableCell>
              <TableCell>{order.phone}</TableCell>
              <TableCell>{order.contactForm}</TableCell>
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
              <TableCell>{order.comment}</TableCell>
              <TableCell>{order.address}</TableCell>
              <TableCell>{order.deliveryType}</TableCell>
              <TableCell>
                <Button
                  loading={loading}
                  onClick={() => {
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
