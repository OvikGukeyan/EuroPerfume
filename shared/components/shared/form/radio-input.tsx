import React, { FC } from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { DeliveryTypesType } from "@/prisma/constants";
import { Label } from "../../ui/label";
import { Title } from "..";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  items: DeliveryTypesType;
  name: string;
}

export const RadioInput: FC<Props> = ({
  className,
  items,
  name,
  onChange,
  value,
}) => {
  return (
    <>
      <Title text={name} size="sm" className="font-bold" />
      <RadioGroup
        className={cn("flex gap-3", className)}
        value={value as string}
        onChange={onChange}
      >
        {items.map((item, index) => (
          <>
            <RadioGroupItem key={index} value={item.value} id={item.value}>
              {item.name}
            </RadioGroupItem>
            <Label htmlFor={item.value}>{item.name}</Label>
          </>
        ))}
      </RadioGroup>
    </>
  );
};
