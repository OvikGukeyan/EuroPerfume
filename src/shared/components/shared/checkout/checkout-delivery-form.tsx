"use client";

import React, { FC } from "react";
import {
  AdressInput,
  ErrorText,
  FormInput,
  FormTextarea,
  MyPopover,
  RadioInput,
  Title,
  WhiteBlock,
} from "..";
import { cn } from "@/src/shared/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { deliveryTypes } from "@/../../prisma/constants";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import Autocomplete from "react-google-autocomplete";
import { ShippingMethods } from "@prisma/client";

interface Props {
  totalAmount: number;
  className?: string;
}
export const CheckoutDeliveryForm: FC<Props> = ({ className, totalAmount }) => {
  const { control, setValue } = useFormContext();
  const t = useTranslations("Checkout");
  return (
    <WhiteBlock
      className={cn(
        className,
        !totalAmount ? "opacity-50 pointer-events-none" : ""
      )}
      title={t("stepTitle")}
      contentClassName="p-8"
    >
      <div className="flex flex-col gap-5">
        <Title text={t("delivery.deliveryAddress")} size="xs" />
        <Tabs
          onValueChange={(value) => {
            setValue("shippingMethod", value);
          }}
          defaultValue={ShippingMethods.BILLING_ADDRESS}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4  h-16 px-4">
            <TabsTrigger
              className="h-10"
              value={ShippingMethods.BILLING_ADDRESS}
            >
              {t("delivery.billingAddress")}
            </TabsTrigger>
            <TabsTrigger
              className="h-10"
              value={ShippingMethods.DIFFERENT_ADDRESS}
            >
              {t("delivery.differentAddress")}
            </TabsTrigger>

            <TabsTrigger className="h-10 " value={ShippingMethods.PACKSTATION}>
              {t("delivery.packstation")}
            </TabsTrigger>
            <TabsTrigger className="h-10 " value={ShippingMethods.POST_OFFICE}>
              {t("delivery.postOffice")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={ShippingMethods.BILLING_ADDRESS}>
            <Title
              className="mb-5"
              text={t("delivery.deliveryType")}
              size="xs"
            />

            <div className="flex justify-between">
              <RadioInput name="deliveryType" items={deliveryTypes} />

              <MyPopover />
            </div>
          </TabsContent>
          <TabsContent
            value={ShippingMethods.DIFFERENT_ADDRESS}
            className="w-full flex flex-col gap-5"
          >
            <Title text={t("delivery.deliveryType")} size="xs" />

            <div className="flex justify-between">
              <RadioInput name="deliveryType" items={deliveryTypes} />

              <MyPopover />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="deliveryFirstName"
                className="text-base"
                placeholder={t("personal.firstName")}
              />
              <FormInput
                name="deliveryLastName"
                className="text-base"
                placeholder={t("personal.lastName")}
              />

              <AdressInput className="md:col-span-2" name="deliveryAddress" />
              <FormInput
                name="deliveryZip"
                className="text-base"
                placeholder={t("delivery.zip")}
              />
            </div>
          </TabsContent>
          <TabsContent value={ShippingMethods.PACKSTATION}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="postNumber"
                className="text-base"
                placeholder={t("delivery.postNumber")}
              />
              <FormInput
                name="packstationNumber"
                className="text-base"
                placeholder={t("delivery.packstationNumber")}
              />
              <FormInput
                name="deliveryZip"
                className="text-base"
                placeholder={t("delivery.zip")}
              />
              <div>
                <Controller
                  control={control}
                  name="deliveryCity"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Autocomplete
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        placeholder="Enter city or postal code"
                        options={{
                          types: ["(regions)"],
                          componentRestrictions: { country: "de" },
                        }}
                        onPlaceSelected={field.onChange}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {error?.message && <ErrorText className="mt-2" text={error.message} />}
                    </>
                  )}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value={ShippingMethods.POST_OFFICE}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                name="postNumber"
                className="text-base"
                placeholder={t("delivery.postNumber")}
              />
              <FormInput
                name="postOffice"
                className="text-base"
                placeholder={t("delivery.officeNumber")}
              />
              <FormInput
                name="deliveryZip"
                className="text-base"
                placeholder={t("delivery.zip")}
              />
              <div>
                <Controller
                  control={control}
                  name="deliveryCity"
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <Autocomplete
                        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                        placeholder="Enter city or postal code"
                        options={{
                          types: ["(regions)"],
                          componentRestrictions: { country: "de" },
                        }}
                        onPlaceSelected={field.onChange}
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-md ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {error?.message && <ErrorText className="mt-2" text={error.message} />}
                    </>
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FormTextarea
        name="comment"
        className="text-base"
        placeholder={t("delivery.commentPlaceholder")}
        rows={5}
      />
    </WhiteBlock>
  );
};
