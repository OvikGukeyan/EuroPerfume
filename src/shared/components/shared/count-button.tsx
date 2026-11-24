"use client";
import { cn } from '@/src/shared/lib/utils';
import { useLocale } from 'next-intl';
import React, { FC } from 'react';
import { CountIconButton } from '.';

export interface CountButtonProps {
  value?: number;
  size?: 'sm' | 'lg';
  onTap?: boolean
  className?: string;
  onClick?: (type: 'plus' | 'minus') => void;
}

export const CountButton: FC<CountButtonProps> = ({
  className,
  onClick,
  onTap,
  value = 1,
  size = 'sm',
}) => {
  const ru = useLocale() === 'ru';
  return (
    <div className={cn('inline-flex flex-row items-center justify-between gap-2 ', className)}>
      <CountIconButton
        onClick={() => onClick?.('minus')}
        disabled={value === 1}
        size={size}
        type="minus"
      />

      <b className={size === 'sm' ? 'text-sm' : 'text-md'}>{value} {onTap ? (ru ? 'мл' : 'ml') : (ru ? 'шт.' : 'Stk.')}</b>

      <CountIconButton onClick={() => onClick?.('plus')} size={size} type="plus" />
    </div>
  );
};
