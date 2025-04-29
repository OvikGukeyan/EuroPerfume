'use client';
import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Rating } from './rating';

type Props = {
  className?: string;
};

export const RatingSelect: FC<Props> = ({ className }) => {
  return (
    <div className={cn('', className)}>
        <Select required name="rating">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stars" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(5)].map((_, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  <div className="flex gap-3 items-center">
                    <span>{index + 1}</span>
                    <Rating value={index + 1} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
    </div>
  );
};