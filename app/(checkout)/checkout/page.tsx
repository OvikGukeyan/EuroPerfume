'use client'

import { Container, OrderDetails, Title, WhiteBlock } from "@/shared/components/shared"
import { Button, Input, Textarea } from "@/shared/components/ui";
import { useCartStore } from "@/shared/store";
import { ArrowRight, Package, Percent, Trash2, Truck } from "lucide-react"
import { useEffect } from "react";

export default function Checkout() {
    const [totalAmount, fetchCartItems, items, updateItemQuantity, removeCartItem, loading] = useCartStore((state) => [state.totalAmount, state.fetchCartItems, state.items, state.updateItemQuantity, state.removeCartItem, state.loading]);

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
                        {/* <div className="flex flex-col gap-5">
  {loading
    ? [...Array(3)].map((_, index) => <CartItemSkeleton key={index} />)
    : items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          imageUrl={item.imageUrl}
          price={item.price}
          quantity={item.quantity}
          onClickRemove={() => removeCartItem(item.id)}
          onClickCountButton={(type) =>
            onClickCountButton(item.id, item.quantity, type)
          }
        />
      ))}
</div> */}

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
                    <WhiteBlock className='p-6 sticky top-4'>
                        <div className="flex flex-col gap-1">
                            <span className="text-xl">Total price:</span>
                            <span className="text-[34px] font-extrabold">55 €</span>
                        </div>

                        <OrderDetails title={
                            <div className="flex items-center">
                                <Package size={18} className="mr-2 text-gray-400" />
                                Order price
                            </div>

                        }
                            value="5" />

                        <OrderDetails title={
                            <div className="flex items-center">
                                <Percent size={18} className="mr-2 text-gray-400" />
                                Fees
                            </div>
                        } value="5" />

                        <OrderDetails title={
                            <div className="flex items-center">
                                <Truck size={18} className="mr-2 text-gray-400" />
                                Delivery
                            </div>
                        } value="5" />

                        <Button
                            type="submit"
                            // disabled={!totalAmount || submitting}
                            className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
                            Move to payment
                            <ArrowRight className="w-5 ml-2" />
                        </Button>
                    </WhiteBlock>


                </div>


            </div>

        </Container>
    )
}