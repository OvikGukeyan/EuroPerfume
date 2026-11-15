'use client';

import React from 'react';
import { X } from 'lucide-react';
import * as CartItemDetails from './cart-item-details';
import { CartItemProps } from './cart-item-details/cart-item-details.types';
import { cn } from '../../lib/utils';
import { CountButton } from './count-button';

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void;
  onClickRemove?: () => void;
  variation?: string;
  className?: string;
  onTap: boolean
}

export const CheckoutItem: React.FC<Props> = ({
  name,
  brand,
  price,
  imageUrl,
  quantity,
  className,
  disabled,
  onClickCountButton,
  onClickRemove,
  variation,
  onTap
}) => {
  return (
    <div className={cn("flex w-full gap-3 border-b border-neutral-100 py-4 last:border-b-0", {"opacity-50 pointer-events-none":disabled},className)}>
      <CartItemDetails.Image src={imageUrl}/>
      <div className="min-w-0 flex-1">
        <CartItemDetails.Info name={name} brand={brand?.name} info={variation || ""}/>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <CountButton onClick={onClickCountButton} value={quantity} onTap={onTap}/>
          <div className="flex items-center gap-2">
            <CartItemDetails.Price value={price}/>
            <button type="button" aria-label={"Remove / Удалить: "+name} onClick={onClickRemove} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-neutral-50">
              <X size={17} className="text-neutral-500"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
