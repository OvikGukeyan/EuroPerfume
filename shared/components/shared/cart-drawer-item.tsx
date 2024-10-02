import { cn } from '@/shared/lib/utils';
import React, { FC } from 'react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';


import * as CartDetail from './cart-item-details';

interface Props extends CartItemProps {
    className?: string
}
export const CartDrawerItem: FC<Props> = ({
    id,
    imageUrl,
    name,
    price,
    quantity,
    className,
  }) => {
  return (
    <div className={cn('flex bg-white p-5 gap-6', className)}>
        <CartDetail.Image src={imageUrl}/>

        <div className='flex-1'>
            
        </div>
    </div>
  )
}
