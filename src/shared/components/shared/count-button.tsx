import { cn } from '@/src/shared/lib/utils';
import React, { FC } from 'react';
import { CountIconButton } from '.';

export interface CountButtonProps {
  value?: number;
  size?: 'sm' | 'lg';
  className?: string;
  onClick?: (type: 'plus' | 'minus') => void;
}

export const CountButton: FC<CountButtonProps> = ({
  className,
  onClick,
  value = 1,
  size = 'sm',
}) => {
  return (
    <div className={cn('inline-flex flex-col md:flex-row items-center justify-between gap-1 md:gap-3 ', className)}>
      <CountIconButton
        onClick={() => onClick?.('minus')}
        disabled={value === 1}
        size={size}
        type="minus"
      />

      <b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value}ml</b>

      <CountIconButton onClick={() => onClick?.('plus')} size={size} type="plus" />
    </div>
  );
};
