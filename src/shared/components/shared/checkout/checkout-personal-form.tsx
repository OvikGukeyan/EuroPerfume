"use client"
import React, { FC } from "react";
import {
  FormInput,
  RadioInput,
  Title,
  WhiteBlock,
} from "..";
import { cn } from "@/src/shared/lib/utils";
import { contactForms } from "@/../../prisma/constants";
import { useTranslations } from "next-intl";
import { AddressInput } from "../address-input";
interface Props {
  totalAmount: number;
  className?: string;
}
export const CheckoutPersonalForm: FC<Props> = ({ className, totalAmount }) => {
  const t = useTranslations("Checkout.personal");
  return (
    <WhiteBlock
      title={t("stepTitle")}
      className={cn(
        "rounded-md border-[#e5e5e5] shadow-none",
        className,
        !totalAmount ? "opacity-50 pointer-events-none" : ""
      )}
      contentClassName="p-5 md:p-7"
    >
      <p className="mb-5 text-xs leading-5 text-[#6d6d6d]">Мы свяжемся с вами после отправки заявки / Wir kontaktieren dich nach der Anfrage.</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <FormInput
          name="firstName"
          className="text-base"
          placeholder={t("firstName")}
        />
        <FormInput
          name="lastName"
          className="text-base"
          placeholder={t("lastName")}
        />
        <FormInput
          name="email"
          className="text-base"
          placeholder={t("email")}
        />
        <FormInput
          name="phone"
          className="text-base"
          placeholder={t("phone")}
        />
        <AddressInput className="md:col-span-2" name="address" />
        
        <div>
          <Title text={t("contactForm")} size="xs" className="mb-3" />
          <RadioInput name="contactForm" items={contactForms} />
        </div>
      </div>
    </WhiteBlock>
  );
};
