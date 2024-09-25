'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { Product } from '@prisma/client'
import { Title } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'
import { ChoosePizzaForm } from '../choose-pizza-form'

interface Props {
    className?: string
    product: Product
}
export const ChooseProductModal: FC<Props> = ({ className, product }) => {
    const router = useRouter();

    const onCloseModal = () => {
        router.back();
    };

    return (
        <Dialog open={Boolean(product)} onOpenChange={onCloseModal}>
            <DialogContent className={cn("p-0 w-[1060px] max-w-[1060px] min-h-[500px] bg-white overflow-hidden", className)}>
                <ChoosePizzaForm imageUrl={product.imageUrl} name={product.name} ingredients={[]}/>
            </DialogContent>
        </Dialog>
    )
}
