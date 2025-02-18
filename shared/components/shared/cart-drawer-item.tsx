
import { cn } from '@/shared/lib/utils';
import React, { FC } from 'react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';


import * as CartDetail from './cart-item-details';
import { Trash2Icon } from 'lucide-react';
import { CountButton } from '.';

interface Props extends CartItemProps {
    onClickCountButton: (type: 'plus' | 'minus') => void;
    onClickRemove: () => void;
    className?: string;
}
export const CartDrawerItem: FC<Props> = ({
    imageUrl,
    name,
    price,
    quantity,
    details,
    disabled,
    onClickCountButton,
    onClickRemove,
    className,
}) => {

   
    return (
        <div className={cn('flex bg-white p-5 gap-6', { 'opacity-50 pointer-events-none': disabled} , className)}>
            <CartDetail.Image src={"https://media.douglas.de/medias/zUsfEz1217085-0-dgl-DE.jpg?context=bWFzdGVyfGltYWdlc3w4Mzg1NnxpbWFnZS9qcGVnfGFHUXdMMmhsTmk4Mk16QTNNelEyT1RnNU1EVTVNQzk2VlhObVJYb3hNakUzTURnMVh6QmZaR2RzTFVSRkxtcHdad3wyYmMxMGVhZGQ5ZjdiNWRjZDMyZDU1Y2QwMTQ4MWY4MzE4NjhkYTJiZjNkODU0MGE3ZTQxOTk4NzA0YWUyYzE4&grid=true&imPolicy=grayScaled&imdensity=1&imwidth=775"} />

            <div className='flex-1'>
                <CartDetail.Info name={'Emporio Armani Stronger with You'} details={'5ml'} />

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
