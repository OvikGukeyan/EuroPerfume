"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React, { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  formRegisterSchema,
  TFormRegisterValues,
} from "./modals/auth-modal/forms/schemas";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { Container, FormInput, Title } from "./";
import { Button } from "..";
import { User } from "@prisma/client";
import { updateUserInfo } from "@/src/app/actions";

interface Props {
  data: User;
  className?: string;
}
export const ProfileForm: FC<Props> = ({ data, className }) => {
  const form = useForm({
    resolver: zodResolver(formRegisterSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      password: "",
      confirmPassword: "",
      acceptPolicy: false,
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      await updateUserInfo({
        email: data.email,
        fullName: data.fullName,
        password: data.password,
      });

      toast.error("User info updated 📝", {
        icon: "✅",
      });
    } catch (error) {
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
          <FormInput name="email" label="E-Mail" required />
          <FormInput name="fullName" label="Полное имя" required />

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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              {...form.register("acceptPolicy")}
              className="accent-blue-600 w-4 h-4"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
          {form.formState.errors.acceptPolicy && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.acceptPolicy.message}
            </p>
          )}

          <Button
            disabled={form.formState.isSubmitting}
            className="text-base mt-10"
            type="submit"
          >
            Save
          </Button>

          <Button
            onClick={onClickSignOut}
            variant="secondary"
            disabled={form.formState.isSubmitting}
            className="text-base"
            type="button"
          >
            Sign out
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};
