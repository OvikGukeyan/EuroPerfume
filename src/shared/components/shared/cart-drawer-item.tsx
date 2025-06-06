
import { cn } from '@/src/shared/lib/utils';
import React, { FC } from 'react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';


import * as CartDetail from './cart-item-details';
import { Trash2Icon } from 'lucide-react';
import { CountButton } from '.';

interface Props extends CartItemProps {
    onClickCountButton: (type: 'plus' | 'minus') => void;
    onClickRemove: () => void;
    variation?: string;
    productGroup?: string;
    className?: string;
}
export const CartDrawerItem: FC<Props> = ({
    imageUrl,
    name,
    price,
    quantity,
    disabled,
    variation,
    productGroup,
    onClickCountButton,
    onClickRemove,
    className,
}) => {

   
    return (
        <div className={cn('flex bg-white p-5 gap-6', { 'opacity-50 pointer-events-none': disabled} , className)}>
            <CartDetail.Image src={imageUrl} />

            <div className='flex-1'>
                <CartDetail.Info name={name} info={variation || productGroup || ''} />

                <hr className='my-3' />

                <div className='flex items-center justify-between'>
                    <CountButton onClick={onClickCountButton} value={quantity} />

                    <div className='flex items-center gap-3'>
                        <CartDetail.Price value={price} />
                        <Trash2Icon
                            className="text-gray-400 cursor-pointer hover:text-gray-600"
                            size={16}
                            onClick={onClickRemove}
                        />
                    </div>
                </div>


            </div>
        </div>
    )
}
