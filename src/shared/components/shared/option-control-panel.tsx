'use client'
import React, { FC } from "react";
import { cn } from "../../lib/utils";
import { FormCheckbox } from "./product-form";
import { Button, CreateNoteForm, Popover, Title } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Trash } from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import { CreateProductFormValues } from "../../constants";

type Props = {
  className?: string;
  items: {
    labelRu: string;
    labelDe: string;
    id: string;
  }[];
  control: Control<CreateProductFormValues>;
  name: keyof CreateProductFormValues;
  title: string;
  onDelete: (value: number) => void;
  onCreate: (value: { labelRu: string; labelDe: string }) => void;
  loading: boolean;
  error: boolean;
};

export const OptionControlPanel: FC<Props> = ({
  className,
  items,
  control,
  name,
  title,
  onDelete,
  onCreate,
  loading,
  error,
}) => {
  const watchedValues = useWatch({
    control,
    name,
  }) as string[];
  const choosedValuesString =
    watchedValues
      ?.map((id: string) => items.find((item) => item.id === id)?.labelRu)
      .join(", ") || "";
  return (
    <div
      className={cn(
        "flex flex-col gap-5 border rounded-sm p-5 mb-5",
        className
      )}
    >
      <Title text={title} size="xs" className="font-bold" />
      <FormCheckbox
        name={name}
        title={choosedValuesString ? choosedValuesString : "Select options"}
        control={control}
        items={items}
      />
      <div className="flex gap-5">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Add new</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <CreateNoteForm
              onSubmit={onCreate}
              loading={loading}
              error={error}
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Delete</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <ul>
              {items.map((item) => (
                <li
                  className="flex items-center justify-between cursor-pointer mb-2 hover:bg-slate-100 h-8 px-2"
                  key={item.id}
                  onClick={() => onDelete(Number(item.id))}
                >
                  <p>{item.labelRu}</p>
                  <Trash size={16} />
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
