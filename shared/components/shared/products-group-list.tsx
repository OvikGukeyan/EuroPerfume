"use client";

import React, { useEffect, useRef } from 'react';
import {useIntersection} from 'react-use';
import { ProductCard } from '.';
import { cn } from '@/shared/lib/utils';
import { useCategoryStore } from '@/shared/store';
import { Product } from '@prisma/client';

interface Props {
    title: string;
    items: Product[];
    className?: string;
    listClassName?: string;
    categoryId: number;
}

export const ProductsGroupList: React.FC<Props> = ({
    title,
    items,
    listClassName,
    categoryId,
    className,
}) => {

    const intersectionRef = useRef(null);
    const intersection = useIntersection(intersectionRef, {threshold: 0.4});

    const setActiveCategoryId = useCategoryStore((store) => store.setActiveId)
    
    useEffect(() => {
        if(intersection?.isIntersecting) {
            setActiveCategoryId(categoryId)
        }
    }, [categoryId, intersection?.isIntersecting, title]);
    
    return (
        <div className={className} id={title} ref={intersectionRef}>
            {/* <Title text={title} size="lg" className="font-extrabold mb-5" /> */}
            <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[50px]', listClassName)}>
                {items
                    .map((product, i) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            imageUrl={product.imageUrl}
                            price={product.price}
                            available={product.available}
                        />
                    ))}
            </div>
        </div>
    )
}
