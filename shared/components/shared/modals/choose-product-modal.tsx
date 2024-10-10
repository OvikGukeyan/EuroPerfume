'use client'

import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'
import { ChooseProductForm } from '../choose-product-form'
import { ProductWithRelations } from '@/@types/prisma'
import { ChoosePizzaForm } from '../choose-pizza-form'
import { useCartStore } from '@/shared/store'
import toast from 'react-hot-toast'
import { on } from 'events'

interface Props {
    product: ProductWithRelations
    className?: string

}
export const ChooseProductModal: FC<Props> = ({ className, product }) => {
    const router = useRouter();
    const firstItem = product.items[0]
    const isPizzaForm = Boolean(firstItem.pizzaType);

    const [addCartItem, loading] = useCartStore(state => [state.addCartItem, state.loading]);





    const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
        try {
            const itemId = productItemId ?? firstItem.id
            await addCartItem({
                productItemId: itemId,
                ingredients
            })
            toast.success(product.name + ' added to cart');
            router.back();
        } catch (error) {
            console.error(error)
            toast.error('Something went wrong')
        }
    }
    const onCloseModal = () => {
        router.back();
    };

    return (
        <Dialog open={Boolean(product)} onOpenChange={onCloseModal}>
            <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden", className)}>
                {isPizzaForm ?
                    <ChoosePizzaForm
                        imageUrl={product.imageUrl}
                        name={product.name}
                        ingredients={product.ingredients}
                        items={product.items}
                        onSubmit={onSubmit}
                        loading={loading}
                    /> :
                    <ChooseProductForm
                        imageUrl={product.imageUrl}
                        name={product.name}
                        onSubmit={onSubmit}
                        price={firstItem.price}
                        loading={loading}

                    />

                }
            </DialogContent>
        </Dialog>
    )
}
