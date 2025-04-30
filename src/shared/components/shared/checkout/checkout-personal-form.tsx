import React, { FC } from "react";
import { FormInput, RadioInput, Title, WhiteBlock } from "..";
import { cn } from "@/src/shared/lib/utils";
import { contactForms } from "@/../../prisma/constants";
import { useTranslations } from "next-intl";
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
        className,
        !totalAmount ? "opacity-50 pointer-events-none" : ""
      )}
      contentClassName="p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
        <div>
          <Title text={t("contactForm")} size="xs" className="mb-3" />
          <RadioInput name="contactForm" items={contactForms} />
        </div>
      </div>
    </WhiteBlock>
  );
};
