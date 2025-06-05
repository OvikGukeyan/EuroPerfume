'use client'

import React, { FC } from 'react'
import { Button } from '../ui'
import { cn } from '@/src/shared/lib/utils'
import { ArrowRight, ShoppingCart } from 'lucide-react'
import { CartDrawer } from './cart-drawer'
import { useCartStore } from '@/src/shared/store'

interface Props {
    className?: string
}
export const CartButton: FC<Props> = ({ className }) => {
    const [totalAmount, loading, itemCount] = useCartStore(state => [state.totalAmount, state.loading, state.items.length])
    return (
        <CartDrawer>
            <Button
            variant='ghost'
                // loading={loading}
                className={cn('group relative', className)}>
                <b className='hidden md:block'>{totalAmount} €</b>
                <span className="hidden md:block h-full w-[1px] bg-black/30 mx-3" />
                <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                    <ShoppingCart size={16} className="relative" strokeWidth={2} />
                    <b>{itemCount}</b>
                </div>
                <ArrowRight size={20} className=" absolute right-5 transition duration-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0" />
            </Button>
        </CartDrawer>
    )
}
