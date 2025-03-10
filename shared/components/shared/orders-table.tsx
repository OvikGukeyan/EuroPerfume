import React, { FC } from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Order } from "@prisma/client";

type Props = {
  className?: string;
  orders: Order[]
};

export const OrdersTable: FC<Props> = ({ className, orders }) => {
    // const items = JSON.parse(orders[0].items)
    // console.log(items)
  return (
    <div className={cn("", className)}>
      <Table>
        <TableCaption>A list of your recent orders.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Order Id</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Customer name</TableHead>
            <TableHead>email</TableHead>
            <TableHead>phone</TableHead>
            <TableHead>comment</TableHead>
            <TableHead>address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.comment}</TableCell>
                <TableCell>{order.address}</TableCell>
              </TableRow>
            ))}
         
        </TableBody>
      </Table>
    </div>
  );
};
