import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Title } from '.';
import { Button } from '../ui';
import { Plus } from 'lucide-react';

interface Props {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    className?: string;
}

export const ProductCard: React.FC<Props> = ({ imageUrl, className, name, price }) => {
    return (
        <div className={className}>
            <Link href={'/product/1'}>
                <div className="flex justify-center p-6 bg-secondary rounded-lg h-[260px]">
                    <Image width={215} height={215} className="w-[215px] h-[215px]" src={imageUrl} alt={name} />
                </div>

                <Title text={name} size="sm" className="mb-1 mt-3 font-bold" />

                <p className="text-sm text-gray-400">
                    Chicken, mozzarella, cheddar and parmesan cheeses, cheese sauce, tomatoes, alfredo sauce, garlic.
                </p>

                <div className="flex justify-between items-center mt-4">
          <span className="text-[20px]">
            от <b>{price} ₽</b>
          </span>

          <Button variant="secondary" className="text-base font-bold">
            <Plus size={20} className="mr-1" />
            Add
          </Button>
        </div>
            </Link>
        </div>
    )
}
