import React, { act, FC } from 'react';
import { cn } from '@/lib/utils';
import { ProductVariation } from '@prisma/client';
import { Button } from '../ui';

type Props = {
  className?: string;
  items: ProductVariation[]
  setActiveVariation: (variation: ProductVariation) => void
  activeVariation: ProductVariation
};

export const ChooseVariation: FC<Props> = ({ className, items, setActiveVariation, activeVariation }) => {
    
  return (
    <div style={{scrollbarWidth: 'none'}} className={cn('flex gap-3 w-full overflow-scroll ', className)}>

      {items.map((item, index) => (

       <Button onClick={() => setActiveVariation(item)} disabled={activeVariation.id === item.id} variant={'outline'} className=" h-8 rounded-none  disabled:bg-slate-300" key={index}>{item.name}</Button >
      ))}
    </div>
  );
};