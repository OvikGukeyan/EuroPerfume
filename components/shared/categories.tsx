"use client"

import { cn } from '@/lib/utils'
import { useCategoryStore } from '@/store/category';
import React from 'react'

const cats = [
    { id: 1, name: 'Pizzas' },
    { id: 2, name: 'Combo' },
    { id: 3, name: 'Apperetizers' },
    { id: 4, name: 'Cocktails' },
    { id: 5, name: 'Cofee' },
    { id: 6, name: 'Drinks' },
    { id: 7, name: 'Deserts' }
  ];
export const Categories = () => {
    const activeIndex = useCategoryStore((state) => state.activeId)

    return (
        <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl')}>
            {cats.map(({id, name}) => (
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
