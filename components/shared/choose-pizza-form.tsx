import { cn } from '@/lib/utils';
import React, { FC } from 'react'
import { ProductImage } from './product-image';
import { Title } from './title';
import { GroupVariants } from './group-variants';
import { Button } from '../ui';

interface Props {
    imageUrl: string;
    name: string;
    ingredients: any[];
    items?: any[];
    onClickAdd?: VoidFunction;
    className?: string;

}
export const ChoosePizzaForm: FC<Props> = ({
    name,
    items,
    imageUrl,
    ingredients,
    onClickAdd,
    className,
}) => {
    const TextDetaills = 'Text 20 text'
    const Price = '14'
    return (
        <div className={cn('flex flex-1', className)}>
            <ProductImage imageUrl={imageUrl} size={30}/>

            <div className='w-[490px] bg-[#f2f2f2] p-7'>
        <Title text={name} size="md" className='font-extrabold mb-1' />

        <p className='text-gray-400'> {TextDetaills}</p>
        <Button className="h-[55px] px-10 text-base rounded-[18px] w-full">
            Add too cart for {Price} €
        </Button>
        <GroupVariants items={[]}/>
        </div>
        </div>
    )
}
