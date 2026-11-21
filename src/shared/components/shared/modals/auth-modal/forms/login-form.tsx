'use client';
import React, { FC, useState } from "react";
import {useLocale} from "next-intl";
import { FormProvider, useForm } from "react-hook-form";
import { formLoginSchema, TFormLoginValues } from "./schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInput, Title } from "../../..";
import Image from "next/image";
import { Button } from "@/src/shared/components/ui";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

interface Props {
  onClose: VoidFunction;
  className?: string;
}
export const LoginForm: FC<Props> = ({ className, onClose }) => {

  const ru=useLocale()==="ru";
  const [sendingVerification,setSendingVerification]=useState(false);
  const resend=async()=>{
    const email=form.getValues("email").trim();
    if(!email){toast.error(ru?"Сначала укажите email.":"Bitte zuerst E-Mail eingeben.");return;}
    setSendingVerification(true);
    try{const res=await fetch("/api/auth/resend-verification",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,locale:ru?"ru":"de"})});
      if(!res.ok)throw new Error("SEND_FAILED");
      toast.success(ru?"Если email ещё не подтверждён, мы отправили новую ссылку. Проверьте почту и спам.":"Falls deine E-Mail noch unbestätigt ist, erhältst du einen neuen Bestätigungslink.");
    }catch{toast.error(ru?"Не удалось отправить письмо. Повторите позже.":"E-Mail konnte nicht versendet werden. Bitte später erneut versuchen.");}
    finally{setSendingVerification(false);}
  };
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(formLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const respons = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!respons?.ok) {
        throw Error();
      }

      toast.success(ru?"Вы вошли в аккаунт":"Erfolgreich angemeldet", { icon: "✅" });

      onClose?.();
    } catch (error) {
      console.error("Error [LOGIN]", error);
      toast.error(ru?"Проверьте email и пароль.":"Bitte E-Mail und Passwort prüfen.", { icon: "❌" });
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
            <Title text={ru?"Войти":"Anmelden"} size="md" className="font-bold" />
            <p className="text-gray-400">{ru?"Введите email и пароль.":"Bitte E-Mail-Adresse und Passwort eingeben."}</p>
          </div>
          <Image
            src="/assets/images/phone-icon.png"
            alt="phone-icon"
            width={60}
            height={60}
          />
        </div>
        <FormInput name="email" label="E-mail" required />
        <FormInput
          name="password"
          label={ru?"Пароль":"Passwort"}
          type="password"
          required
        />

        <Button
          loading={form.formState.isSubmitting}
          className="h-12 text-base"
          type="submit"
        >
          {ru?"Войти":"Anmelden"}
        </Button>
        <button type="button" disabled={sendingVerification} onClick={()=>void resend()} className="text-left text-sm text-[#73534f] underline underline-offset-4 disabled:opacity-50">{ru?"Не получили письмо подтверждения? Отправить ещё раз":"Keine Bestätigung erhalten? E-Mail erneut senden"}</button>
      </form>
    </FormProvider>
  );
};
