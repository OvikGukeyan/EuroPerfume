import { z } from 'zod';

export const checkoutFormSchema = z.object({
    firstName: z.string().min(2, { message: 'First Name must be at least 2 characters long' }),
    lastName: z.string().min(2, { message: 'Last Name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().min(10, { message: 'Invalid phone number' }),
    address: z.string().min(5, { message: 'Invalid address' }),
    comment: z.string().optional()
});


export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;