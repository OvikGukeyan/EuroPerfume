'use client'

import { CheckoutCart, CheckoutDeliveryForm, CheckoutPersonalForm, CheckoutSidebar, Container, Title } from "@/shared/components/shared"
import { useCart } from "@/shared/hooks";
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/components/shared/checkout/schemas/checkout-form-schema";


export default function Checkout() {
    const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart()

    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        }
    })

    const onSubmit = (data: CheckoutFormValues) => {

        console.log(data)
    }


    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity)
    }



    return (
        <Container className="mt-10">
            <Title text="Checkout" size="xl" className="font-extrabold mb-8" />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-10">
                        <div className="flex flex-col gap-10 flex-1 mb-20">

                            <CheckoutCart items={items} totalAmount={totalAmount} removeCartItem={removeCartItem} onClickCountButton={onClickCountButton} />

                            <CheckoutPersonalForm totalAmount={totalAmount} />

                            <CheckoutDeliveryForm totalAmount={totalAmount} />
                        </div>

                        <div className="w-[450px]">
                            <CheckoutSidebar
                                totalAmount={totalAmount}
                            />


                        </div>


                    </div>
                </form>
            </FormProvider>


        </Container>
    )
}