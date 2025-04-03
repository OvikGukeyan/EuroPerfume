import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { OrderDTO } from "@/shared/services/dto/orders.dto";

type Props = {
  className?: string;
  order: OrderDTO;
};

export const OrderItemsPopover: FC<Props> = ({ className, order }) => {
  return (
    <div className={cn("", className)}>
      <Popover>
        <PopoverTrigger>Items</PopoverTrigger>
        <PopoverContent>
          <ul>
            {order.items.map((item) => (
              <li className="flex justify-between" key={item.id}>
                <p>{item.name}</p>
                <p>{item.variation && item.variation.name}</p>
                <p>{item.quantity}</p>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
