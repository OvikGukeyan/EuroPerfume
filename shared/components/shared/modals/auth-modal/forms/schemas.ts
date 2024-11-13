import { z } from "zod";

export const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters long' })

export const formLoginSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
    password: passwordSchema
});

export const formRegisterSchema = formLoginSchema.merge(
    z.object({
        fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
        confirmPassword: passwordSchema
    })
).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;