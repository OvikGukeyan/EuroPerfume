'use client'

import { Dialog, DialogContent } from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'
import { ProductWithRelations } from '@/@types/prisma'
import { ProductForm } from '..'

interface Props {
    product: ProductWithRelations
    className?: string

}
export const ChooseProductModal: FC<Props> = ({ className, product }) => {
    const router = useRouter();

    const onCloseModal = () => {
        router.back();
    };

    return (
        <Dialog open={Boolean(product)} onOpenChange={onCloseModal}>
            <DialogContent className={cn("p-0 w-full h-full sm:w-[600px] sm:h-auto lg:w-[1060px] max-w-[1060px]  bg-white md:rounded-sm overflow-scroll", className)}>
                <ProductForm product={product} onSubmit={onCloseModal} />
            </DialogContent>
        </Dialog>
    )
}
