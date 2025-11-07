import { ContactForms, ShippingMethods } from "@prisma/client";
import { z } from "zod";

export const checkoutFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Der Vorname muss mindestens 2 Zeichen lang sein." })
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Der Vorname darf nur lateinische Buchstaben enthalten.",
      }),

    lastName: z
      .string()
      .min(2, { message: "Der Nachname muss mindestens 2 Zeichen lang sein." })
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Der Nachname darf nur lateinische Buchstaben enthalten.",
      }),

    email: z.string().email({ message: "Ungültige E-Mail-Adresse." }),
    phone: z.string().min(10, { message: "Ungültige Telefonnummer." }),
    address: z.string().min(5, { message: "Ungültige Adresse." }),
    houseNumber: z.string().min(1, { message: "Ungültige Hausnummer." }),
    city: z.string().min(2, { message: "Ungültige Stadt." }),
    country: z.string().min(2, { message: "Ungültiges Land." }),
    zip: z.string().min(4, { message: "Ungültige Postleitzahl." }),

    deliveryFirstName: z
      .string()
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Der Vorname darf nur lateinische Buchstaben enthalten.",
      })
      .optional()
      .or(z.literal("")),

    deliveryLastName: z
      .string()
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Der Nachname darf nur lateinische Buchstaben enthalten.",
      })
      .optional()
      .or(z.literal("")),

    deliveryAddress: z.string().optional(),
    deliveryHouseNumber: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryCountry: z.string().optional(),
    deliveryZip: z.string().optional(),
    postNumber: z.string().optional(),
    postOffice: z.string().optional(),
    packstationNumber: z.string().optional(),

    comment: z.string().optional(),
    contactForm: z.nativeEnum(ContactForms),
    shippingMethod: z.nativeEnum(ShippingMethods),
    promocode: z.string().optional(),
    discount: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const { shippingMethod } = data;

    if (shippingMethod === ShippingMethods.DIFFERENT_ADDRESS) {
      if (!data.deliveryFirstName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Vorname ist erforderlich.",
          path: ["deliveryFirstName"],
        });
      }
      if (!data.deliveryLastName?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Nachname ist erforderlich.",
          path: ["deliveryLastName"],
        });
      }
      if (!data.deliveryAddress?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Adresse ist erforderlich.",
          path: ["deliveryAddress"],
        });
      }
      if (!data.deliveryHouseNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Hausnummer ist erforderlich.",
          path: ["deliveryHouseNumber"],
        });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Postleitzahl ist erforderlich.",
          path: ["deliveryZip"],
        });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Stadt ist erforderlich.",
          path: ["deliveryCity"],
        });
      }
      if (!data.deliveryCountry?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Land ist erforderlich.",
          path: ["deliveryCountry"],
        });
      }
    }

    if (shippingMethod === ShippingMethods.PACKSTATION) {
      if (!data.packstationNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Packstation-Nummer ist erforderlich.",
          path: ["packstationNumber"],
        });
      }
      if (!data.postNumber?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Postnummer ist erforderlich.",
          path: ["postNumber"],
        });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Postleitzahl ist erforderlich.",
          path: ["deliveryZip"],
        });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Stadt ist erforderlich.",
          path: ["deliveryCity"],
        });
      }
      if (!data.deliveryCountry?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Land ist erforderlich.",
          path: ["deliveryCountry"],
        });
      }
    }

    if (shippingMethod === ShippingMethods.POST_OFFICE) {
      if (!data.postOffice?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Postfiliale ist erforderlich.",
          path: ["postOffice"],
        });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Postleitzahl ist erforderlich.",
          path: ["deliveryZip"],
        });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Stadt ist erforderlich.",
          path: ["deliveryCity"],
        });
      }
      if (!data.deliveryCountry?.trim()) {
        ctx.addIssue({
          code: "custom",
          message: "Land ist erforderlich.",
          path: ["deliveryCountry"],
        });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;