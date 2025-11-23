import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });
export const emailSchema = z
  .string()
  .trim()
  .email({ message: "Enter a valid email address" });

export const getEmailSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const formLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const formRegisterSchema = formLoginSchema
  .merge(
    z.object({
      fullName: z
        .string()
        .min(2, { message: "Full name must be at least 2 characters long" }),
      confirmPassword: passwordSchema,

      acceptPolicy: z.boolean().refine((val) => val === true, {
        message: "You must accept the policy",
      }),
    })
  )
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
export type TFormGetEmailValues = z.infer<typeof getEmailSchema>;
export type TFormResetPasswordValues = z.infer<typeof resetPasswordSchema>;
