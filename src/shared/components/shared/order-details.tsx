import { cn } from '@/src/shared/lib/utils';
import React, { FC } from 'react'
import { Skeleton } from '../ui';

interface Props {
    title: React.ReactNode;
    value: React.ReactNode;
    className?: string;

}
export const OrderDetails: FC<Props> = ({ className, title, value }) => {
    return (
        <div className={cn("flex items-center justify-between gap-3 my-4", className)}>
            <span className="flex flex-1 text-sm text-neutral-600">
                {title}:

            </span>
            <span className="shrink-0 font-semibold text-sm tabular-nums">{value} </span>

        </div>
    )
}
