"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  resetPasswordSchema,
  TFormResetPasswordValues,
} from "./modals/auth-modal/forms/schemas";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { FormInput, Title } from "./";
import { Button } from "..";
import { resetPassword } from "@/src/app/actions";
import { useRouter } from "@/src/i18n/navigation";

interface Props {
  code: string;
  className?: string;
}
export const ResetForm: FC<Props> = ({ code, className }) => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: TFormResetPasswordValues) => {
    try {
      await resetPassword(code, data.password);

      toast.error("Password updated 📝", {
        icon: "✅",
      });

      router.push("/");
    } catch (error) {
      console.error("Error [RESET_PASSWORD]", error);
      return toast.error("Something went wrong", {
        icon: "❌",
      });
    }
  };

  const onClickSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex flex-col">
      <Title text="Personal info" size="md" className="font-bold" />

      <FormProvider {...form}>
        <form
          className="flex flex-col gap-5 w-72 md:w-96 mt-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormInput
            type="password"
            name="password"
            label="Новый пароль"
            required
          />
          <FormInput
            type="password"
            name="confirmPassword"
            label="Повторите пароль"
            required
          />
          <Button
            disabled={form.formState.isSubmitting}
            className="text-base mt-10"
            type="submit"
          >
            Save
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
