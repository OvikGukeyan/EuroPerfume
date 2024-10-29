'use client'

import { CheckoutItem, CheckoutSidebar, Container, OrderDetails, Title, WhiteBlock } from "@/shared/components/shared"
import { Input, Textarea } from "@/shared/components/ui";
import { PizzaSize, PizzaType } from "@/shared/constants/pizza";
import { useCart } from "@/shared/hooks";
import { getCartItemDetails } from "@/shared/lib";
import { Trash2 } from "lucide-react";




export default function Checkout() {
    const { totalAmount, items, updateItemQuantity, removeCartItem } = useCart()

    const onClickCountButton = (id: number, quantity: number, type: 'plus' | 'minus') => {
        const newQuantity = type === 'plus' ? quantity + 1 : quantity - 1;
        updateItemQuantity(id, newQuantity)
    }

    

    return (
        <Container className="mt-10">
            <Title text="Checkout" size="xl" className="font-extrabold mb-8" />
            <div className="flex gap-10">
                <div className="flex flex-col gap-10 flex-1 mb-20">

                    <WhiteBlock
                        title="1. Cart"
                        endAdornment={
                            totalAmount > 0 && (
                                <button className="flex items-center gap-3 text-gray-400 hover:text-gray-600">
                                    <Trash2 size={16} />
                                    Clear the Cart
                                </button>
                            )
                        }>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-5">
                                {
                                    items.map((item) => (
                                        <CheckoutItem
                                            key={item.id}
                                            id={item.id}
                                            details={getCartItemDetails(item.pizzaType as PizzaType, item.pizzaSize as PizzaSize, item.ingredients)}
                                            imageUrl={item.imageUrl}
                                            name={item.name}
                                            price={item.price}
                                            quantity={item.quantity}
                                            disabled={item.disabled}
                                            onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
                                            onClickRemove={() => removeCartItem(item.id)}
                                        />
                                    ))
                                }
                            </div>

                        </div>

                        {!totalAmount && <p className="text-center text-gray-400 p-10">The cart is empty</p>}
                    </WhiteBlock>

                    <WhiteBlock
                        title="2. Персональная информация"
                        // className={!totalAmount ? 'opacity-50 pointer-events-none' : ''}
                        contentClassName="p-8">
                        <div className="grid grid-cols-2 gap-5">
                            <Input name="firstName" className="text-base" placeholder="Имя" />
                            <Input name="lastName" className="text-base" placeholder="Фамилия" />
                            <Input name="email" className="text-base" placeholder="E-Mail" />
                            <Input name="phone" className="text-base" placeholder="Телефон" />
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
                                className="text-base"
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