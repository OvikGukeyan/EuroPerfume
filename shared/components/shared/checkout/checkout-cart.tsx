'use client'

import React, { FC } from 'react'
import { CheckoutItem, WhiteBlock } from '..'
import { Trash2 } from 'lucide-react'
import { PizzaSize, PizzaType } from '@/shared/constants/pizza'
import { getCartItemDetails } from '@/shared/lib'
import { CartStateItem } from '@/shared/lib/get-cart-details'

interface Props {
    items: CartStateItem[];
    totalAmount: number;
    removeCartItem: (id: number) => void;
    onClickCountButton: (id: number, quantity: number, type: 'plus' | 'minus') => void
    className?: string
}
export const CheckoutCart: FC<Props> = ({ className, items, totalAmount, removeCartItem, onClickCountButton }) => {
    return (
        <WhiteBlock
            className={className}
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
    )
}
