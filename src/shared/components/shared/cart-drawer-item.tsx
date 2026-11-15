
import { cn } from '@/src/shared/lib/utils';
import React, { FC } from 'react';
import { CartItemProps } from './cart-item-details/cart-item-details.types';


import * as CartDetail from './cart-item-details';
import { Trash2Icon } from 'lucide-react';
import { CountButton } from '.';
import { useLocale } from 'next-intl';
import { ProductGroup } from '@prisma/client';

interface Props extends CartItemProps {
    onClickCountButton: (type: 'plus' | 'minus') => void;
    onClickRemove: () => void;
    variation?: string;
    productGroup?: ProductGroup;
    className?: string;
}
export const CartDrawerItem: FC<Props> = ({
    imageUrl,
    name,
    price,
    brand,
    quantity,
    disabled,
    variation,
    productGroup,
    onClickCountButton,
    onClickRemove,
    className,
}) => {

    const ru=useLocale()==="ru";
    return (
        <div className={cn('flex bg-white py-5 gap-3', { 'opacity-50 pointer-events-none': disabled} , className)}>
            <CartDetail.Image src={imageUrl} />

            <div className='min-w-0 flex-1'>
                <CartDetail.Info name={name} brand={brand?.name} info={variation || (ru?productGroup?.labelRu:productGroup?.labelDe) || ''} />

                <div className='h-3' />

                <div className='flex flex-wrap items-center justify-between gap-2'>
                    <CountButton onTap={Boolean(productGroup?.onTap)} onClick={onClickCountButton} value={quantity} />

                    <div className='flex items-center gap-1'>
                        <CartDetail.Price value={price} />
                        <button type='button' aria-label={(ru?'Удалить ':'Entfernen ')+name} onClick={onClickRemove} className='flex h-9 w-9 items-center justify-center'><Trash2Icon
                            className="text-gray-400 cursor-pointer hover:text-gray-600"
                            size={16}
                        /></button>
                    </div>
                </div>


            </div>
        </div>
    )
}
