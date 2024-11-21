import { cn } from '@/shared/lib/utils';
import React, { FC } from 'react'
import { Title } from './title';
import { GroupVariants } from './group-variants';
import { Button } from '../ui';
import Image from 'next/image'

interface Props {
    imageUrl: string;
    name: string;
    price: number;
    loading: boolean;
    onSubmit?: VoidFunction;
    className?: string;

}
export const ChooseProductForm: FC<Props> = ({
    name,
    imageUrl,
    price,
    loading,
    onSubmit,
    className,
}) => {
    return (
        <div className={cn('flex flex-col lg:flex-row flex-1', className)}>
            <div className={cn('flex  items-center justify-center flex-1 relative w-full', className)}>
                <Image
                    width={350}
                    height={350}
                    src={imageUrl}
                    alt='pizza'
                    className='relative left-2 top-2 tranzition-all z-10 duration-300 w-[350px] h-[350px] '
                />
            </div>

            <div className='w-full lg:w-[490px] bg-[#f2f2f2] p-7'>
                <Title text={name} size="md" className='font-extrabold mb-1' />

                <Button loading={loading} onClick={() => onSubmit?.()} className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                    Add too cart for {price} €
                </Button>
                <GroupVariants items={[]} />
            </div>
        </div>
    )
}
