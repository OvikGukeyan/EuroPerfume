"use client";
import React, { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { emailSchema, formLoginSchema, getEmailSchema, TFormGetEmailValues, TFormLoginValues } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Title } from "../../..";
import Image from "next/image";
import { Button } from "@/shared/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { getRecoveringEmail } from "@/app/actions";

interface Props {
  onClose: VoidFunction;
  className?: string;
}
export const GetEmail: FC<Props> = ({ className, onClose }) => {
  const form = useForm<TFormGetEmailValues>({
    resolver: zodResolver(getEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: TFormGetEmailValues) => {
    try {
      await getRecoveringEmail(data.email);
      

     

      toast.success("We sent you an email. Check your inbox", { icon: "✅" });

      onClose?.();
    } catch (error) {
      console.error("Error [RECOVER_PASSWORD]", error);
      toast.error("Something went wrong", { icon: "❌" });
    }
  };
  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex justify-between items-center">
          <div className="mr-2">
            <Title text="Recover password" size="md" className="font-bold" />
            <p className="text-gray-400">Enter your email to recover</p>
          </div>
          <Image
            src="/assets/images/phone-icon.png"
            alt="phone-icon"
            width={60}
            height={60}
          />
        </div>
        <FormInput name="email" label="E-mail" required />

        <Button
          loading={form.formState.isSubmitting}
          className="h-12 text-base"
          type="submit"
        >
          Recover
        </Button>
      </form>
    </FormProvider>
  );
};
