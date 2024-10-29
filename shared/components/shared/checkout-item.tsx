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
  className?: string;
}

export const CheckoutItem: React.FC<Props> = ({
  name,
  price,
  imageUrl,
  quantity,
  details,
  className,
  disabled,
  onClickCountButton,
  onClickRemove,
}) => {
  return (
    <div className={cn('flex items-center justify-between', { 'opacity-50 pointer-events-none': disabled}, className)}>
      <div className="flex items-center gap-5 flex-1">
        <CartItemDetails.Image src={imageUrl} />
        <CartItemDetails.Info name={name} details={details} clssName='w-1/2'/>
      </div>

      <CartItemDetails.Price value={price} />

      <div className="flex items-center gap-5 ml-20">
      <CountButton onClick={onClickCountButton} value={quantity} />
        <button onClick={onClickRemove}>
          <X className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
        </button>
      </div>
    </div>
  );
};
