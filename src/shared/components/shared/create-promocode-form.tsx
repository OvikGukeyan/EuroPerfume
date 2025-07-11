"use client";
import React, { FC, useState } from "react";
import { cn } from "../../lib/utils";
import { Control, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { CreatePromocodeValues, CreatePromocodeSchema } from "../../constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput } from ".";
import { Button, Popover } from "..";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { se } from "date-fns/locale";
import { createPromocode } from "@/src/app/actions";
import toast from "react-hot-toast";

type Props = {
  className?: string;
};

export const CreatePromocodeForm: FC<Props> = ({ className }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<CreatePromocodeValues>({
    resolver: zodResolver(CreatePromocodeSchema),
    defaultValues: {
      code: "",
      discount: undefined,
      expirationDate: undefined,
    },
  });

  const onSubmit = async (data: CreatePromocodeValues) => {
    try {
      setLoading(true);
      await createPromocode(data);
      form.reset();
    } catch (error) {
      console.log("Error [CREATE_PROMOCODE]", error);
      toast.error("Something went wrong", { icon: "❌" });
    }finally {
      setLoading(false);
    }
  };
  return (
    <div className={cn("w-[400px]", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="code"
            control={form.control as Control<CreatePromocodeValues>}
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormControl>
                  <FormInput
                    label="Код промокода"
                    {...field}
                    placeholder="Код промокода"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="discount"
            control={form.control as Control<CreatePromocodeValues>}
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormControl>
                  <FormInput
                    label="Скидка"
                    {...field}
                    placeholder="Скидка"
                    type="number"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="expirationDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-5 flex flex-col">
                <label
                  htmlFor="expirationDate"
                  className="px-1 text-sm font-medium text-muted-foreground"
                >
                  Дата окончания промокода
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="expirationDate"
                      className="w-48 justify-between font-normal"
                    >
                      {field.value
                        ? field.value.toLocaleDateString()
                        : "Выберите дату"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          />

          <Button loading={loading} type="submit">
            Create
          </Button>
        </form>
      </Form>
    </div>
  );
};
