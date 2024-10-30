'use client'

import { CheckoutCart, CheckoutItem, CheckoutSidebar, Container, FormInput, Title, WhiteBlock } from "@/shared/components/shared"
import { Input, Textarea } from "@/shared/components/ui";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { useCart } from "@/shared/hooks";
import { getCartItemDetails } from "@/shared/lib";
import { Check, Trash2 } from "lucide-react";
import { useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'


export default function Checkout() {
    const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart()

    const form = useForm({
        // resolver: zodResolver(),
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            comment: '',
        }
    })


    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity)
    }



    return (
        <Container className="mt-10">
            <Title text="Checkout" size="xl" className="font-extrabold mb-8" />
            <div className="flex gap-10">
                <div className="flex flex-col gap-10 flex-1 mb-20">

                    <CheckoutCart items={items} totalAmount={totalAmount} removeCartItem={removeCartItem} onClickCountButton={onClickCountButton} />

                    <WhiteBlock
                        title="2. Персональная информация"
                        // className={!totalAmount ? 'opacity-50 pointer-events-none' : ''}
                        contentClassName="p-8">
                        <div className="grid grid-cols-2 gap-5">
                            <Input name="firstName" className="text-base" placeholder="Имя" />
                            <Input name="lastName" className="text-base" placeholder="Фамилия" />
                            <Input name="email" className="text-base" placeholder="E-Mail" />
                            <FormInput name="phone" className="text-base" placeholder="Телефон" />
                        </div>
                    </WhiteBlock>

                    <WhiteBlock
                        className={!totalAmount ? 'opacity-50 pointer-events-none' : ''}
                        title="3. Delivery information"
                        contentClassName="p-8">
                        <div className="flex flex-col gap-5">
                            {/* <Controller
                                control={form.control}
                                name="address"
                                render={({ field }) => <AdressInput onChange={field.onChange} />}
                            /> */}

                            <Textarea
                                name="comment"
                                className="text-base resize-none"
                                placeholder="Description"
                                rows={5}

                            />
                        </div>
                    </WhiteBlock>
                </div>

                <div className="w-[450px]">
                    <CheckoutSidebar
                        totalAmount={totalAmount}
                    />


                </div>


            </div>

        </Container>
    )
}