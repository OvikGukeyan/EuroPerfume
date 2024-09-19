"use client"

import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category';
import { Category } from '@prisma/client';
import React, { FC } from 'react'

interface Props {
    className?: string
    items: Category[]
}
export const Categories: FC<Props> = ({items}) => {
    const activeIndex = useCategoryStore((state) => state.activeId)

    return (
        <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl')}>
            {items.map(({id, name}) => (
                <a  
                    href={`/#${name}`}
                    className={cn(
                        'flex items-center font-bold h-11 rounded-2xl px-5',
                        activeIndex === id && 'bg-white shadow-md shadow-gray-200 text-primary')} key={id}>
                    <button>
                        {name}
                    </button>
                </a>
            ))}
        </div>
    )
}
