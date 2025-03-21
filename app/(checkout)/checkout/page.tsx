'use client'

import { CheckoutCart, CheckoutDeliveryForm, CheckoutPersonalForm, CheckoutSidebar, Container, Title } from "@/shared/components"
import { useCart } from "@/shared/hooks";
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants/";
import { createOrder } from "@/app/actions";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Api } from "@/shared/services/api-client";
import { useRouter } from "next/navigation";
import { ContactForms, DeliveryTypes } from "@prisma/client";
import { deliveryTypes } from "@/prisma/constants";
import { calcTotlalAmountWithDelivery } from "@/shared/lib";


export default function Checkout() {
    const [submitting, setSubmitting] = useState(false);
    const { totalAmount, items, updateItemQuantity, removeCartItem, loading, itemLoading } = useCart()
    const {data: session} = useSession();
    const router = useRouter();
    
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            contactForm: ContactForms.WA,
            comment: '',
            deliveryType: DeliveryTypes.GB
        },
    });

    const delivery = form.watch('deliveryType');
    const {totalAmountWithDelivery, deliveryPrice} = calcTotlalAmountWithDelivery(totalAmount, delivery);

    useEffect(() => {
        async function fetchUserInfo() {
            const data = await Api.auth.getMe();
            const [firstName, lastName] = data.fullName.split(' ');

            form.setValue('firstName', firstName);
            form.setValue('lastName', lastName);
            form.setValue('email', data.email);
        }

        if(session) {
            fetchUserInfo();
        }
    }, [session])

    const onSubmit = async (data: CheckoutFormValues) => {
        try {
            setSubmitting(true);
            const order = await createOrder(data);
            toast.success('Order created successfully! ', {
                icon: '✅',
            })

            router.push(`/`);

        } catch (error) {
            setSubmitting(false);
            console.log(error);
            toast.error('Failed to create order', {
                icon: '🚨',
            })
        }finally {
            setSubmitting(false);
        }
    }


    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity)
    }



    return (
        <div className="mt-10">
            <Title text="Checkout" size="xl" className="font-extrabold mb-8" />
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col lg:flex-row gap-10">
                        <div className="flex flex-col gap-10 flex-1 mb-20">

                            <CheckoutCart loading={loading} items={items} totalAmount={totalAmount} removeCartItem={removeCartItem} onClickCountButton={onClickCountButton} />

                            <CheckoutPersonalForm totalAmount={totalAmount} />

                            <CheckoutDeliveryForm totalAmount={totalAmount} />
                        </div>

                        <div className="w-full lg:w-[450px] mx-auto">
                            <CheckoutSidebar
                                itemLoading={itemLoading}
                                loading={loading || submitting}
                                totalAmount={totalAmount}
                                deliveryPrice={deliveryPrice}
                            />


                        </div>


                    </div>
                </form>
            </FormProvider>


        </div>
    )
}