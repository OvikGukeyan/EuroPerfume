import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { Review } from '.';

type Props = {
  className?: string;
};

export const ReviewsList: FC<Props> = ({ className }) => {
  return (
    <div className={cn('bg-secondary px-16 py-20 flex flex-col gap-14 ', className)}>
        <Review />
        <Review />
        <Review />
        <Review />
        <Review />
    </div>
  );
};