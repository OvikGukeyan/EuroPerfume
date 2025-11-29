"use client";
import React, { FC } from "react";
import { cn } from "@/src/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { PromoCode } from "@prisma/client";



type Props = {
  className?: string;
  items: PromoCode[];
};

export const PromoTable: FC<Props> = ({ className, items }) => {
  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Код</TableHead>
            <TableHead>Скидка</TableHead>
            <TableHead>Действителен до</TableHead>
            <TableHead>Одноразовый</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.code} </TableCell>
              <TableCell>{order.discount}</TableCell>
              <TableCell>{order.expiresAt?.toDateString()}</TableCell>
              <TableCell>{order.disposable ? "Да" : "Нет"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
