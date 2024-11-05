"use client"

import { cn } from '@/shared/lib/utils'
import { useCategoryStore } from '@/shared/store';
import { Category } from '@prisma/client';
import React, { FC } from 'react'

interface Props {
    className?: string
    items: Category[]
}
export const Categories: FC<Props> = ({items}) => {
    const activeIndex = useCategoryStore((state) => state.activeId)

    return (
        <div style={{scrollbarWidth: 'none'}} className={cn('flex max-w-full gap-1 bg-gray-50 p-1 rounded-2xl overflow-x-auto whitespace-nowrap no-scrollbar ')}>
            {items.map(({id, name}) => (
                <a  
                    href={`/#${name}`}
                    className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-5 ',
                        activeIndex === id && 'bg-white shadow-md shadow-gray-200 text-primary')} key={id}>
                    <button>
                        {name}
                    </button>
                </a>
            ))}
        </div>
    )
}
