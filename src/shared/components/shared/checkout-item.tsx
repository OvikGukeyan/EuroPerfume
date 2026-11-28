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
  packMl?: number | null;
  lockedCount?: boolean;
  options?: React.ReactNode;
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
  onTap, packMl, lockedCount, options
}) => {
  return (
    <div className={cn("flex w-full items-start gap-4 border-b border-[#ededed] py-5 last:border-b-0", {"opacity-50 pointer-events-none":disabled},className)}>
      <div className="flex h-28 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[#f7f7f6] sm:h-32 sm:w-28"><CartItemDetails.Image src={imageUrl}/></div>
      <div className="min-w-0 flex-1">
        <CartItemDetails.Info name={name} brand={brand?.name} info={variation || ""}/>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {lockedCount ? <span>{quantity} ml</span> :
            <CountButton onClick={onClickCountButton} value={packMl ? quantity/packMl : quantity} onTap={onTap} packMl={packMl}/>}
          <div className="flex items-center gap-2">
            <strong className="text-[16px] font-semibold tabular-nums"><CartItemDetails.Price value={price}/></strong>
            <button type="button" aria-label={"Remove / Удалить: "+name} onClick={onClickRemove} className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-black">
              <X size={17} className="text-neutral-500"/>
            </button>
          </div>
        </div>
        {options}
      </div>
    </div>
  );
};
