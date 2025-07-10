import { ContactForms, DeliveryTypes, ShippingMethods } from "@prisma/client";
import { z } from "zod";

export const checkoutFormSchema = z
  .object({
    firstName: z.string().min(2, { message: "First Name must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "Last Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().min(10, { message: "Invalid phone number" }),
    address: z.string().min(5, { message: "Invalid address" }),
    city: z.string().min(2, { message: "Invalid city" }),
    zip: z.string().min(5, { message: "Invalid zip code" }),

    // Опциональные поля (валидируются вручную)
    deliveryFirstName: z.string().optional(),
    deliveryLastName: z.string().optional(),
    deliveryAddress: z.string().optional(),
    deliveryCity: z.string().optional(),
    deliveryZip: z.string().optional(),
    postNumber: z.string().optional(),
    postOffice: z.string().optional(),
    packstationNumber: z.string().optional(),

    comment: z.string().optional(),
    deliveryType: z.nativeEnum(DeliveryTypes),
    contactForm: z.nativeEnum(ContactForms),
    shippingMethod: z.nativeEnum(ShippingMethods),
    promocode: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { shippingMethod } = data;

    if (shippingMethod === ShippingMethods.DIFFERENT_ADDRESS) {
      if (!data.deliveryFirstName?.trim()) {
        ctx.addIssue({ code: "custom", message: "First name is required", path: ["deliveryFirstName"] });
      }
      if (!data.deliveryLastName?.trim()) {
        ctx.addIssue({ code: "custom", message: "Last name is required", path: ["deliveryLastName"] });
      }
      if (!data.deliveryAddress?.trim()) {
        ctx.addIssue({ code: "custom", message: "Address is required", path: ["deliveryAddress"] });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({ code: "custom", message: "ZIP code is required", path: ["deliveryZip"] });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({ code: "custom", message: "City is required", path: ["deliveryCity"] });
      }
    }

    if (shippingMethod === ShippingMethods.PACKSTATION) {
      if (!data.packstationNumber?.trim()) {
        ctx.addIssue({ code: "custom", message: "Packstation number is required", path: ["packstationNumber"] });
      }
      if (!data.postNumber?.trim()) {
        ctx.addIssue({ code: "custom", message: "Post number is required", path: ["postNumber"] });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({ code: "custom", message: "ZIP code is required", path: ["deliveryZip"] });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({ code: "custom", message: "City is required", path: ["deliveryCity"] });
      }
    }

    if (shippingMethod === ShippingMethods.POST_OFFICE) {
      if (!data.postOffice?.trim()) {
        ctx.addIssue({ code: "custom", message: "Post office is required", path: ["postOffice"] });
      }
      if (!data.deliveryZip?.trim()) {
        ctx.addIssue({ code: "custom", message: "ZIP code is required", path: ["deliveryZip"] });
      }
      if (!data.deliveryCity?.trim()) {
        ctx.addIssue({ code: "custom", message: "City is required", path: ["deliveryCity"] });
      }
    }
  });

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;