'use client'

import { cn } from '@/shared/lib/utils';
import React, { FC } from 'react'
import { Title } from './title';
import { GroupVariants } from './group-variants';
import { Button } from '../ui';
import { PizzaSize, PizzaType, pizzaTypes } from '@/shared/constants/pizza';
import { IngredientItem, PizzaImage } from '.';
import { Ingredient, ProductItem } from '@prisma/client';
import { getPizzaDetails, usePizzaOptions } from '@/shared/lib';

interface Props {
    imageUrl: string;
    name: string;
    ingredients: Ingredient[];
    items: ProductItem[];
    onClickAddCart?: VoidFunction;
    className?: string;

}
export const ChoosePizzaForm: FC<Props> = ({
    name,
    items,
    imageUrl,
    ingredients,
    onClickAddCart,
    className,
}) => {
    
    const { size, type, setSize, setType, selectedIngredients, addIngredient, availableSizes } = usePizzaOptions( items);


    const { TextDetaills, totalPrice } = getPizzaDetails(size, type, items, ingredients, selectedIngredients);

    const handeleClickAdd = () => {
        onClickAddCart?.();
        console.log({
            size,
            type,
            ingredients: selectedIngredients
        })
    };


    

    return (
        <div className={cn('flex flex-1 ', className)}>
            <PizzaImage imageUrl={imageUrl} size={size} />

            <div className='w-[490px] bg-[#f2f2f2] p-7'>
                <Title text={name} size="md" className='font-extrabold mb-1' />

                <p className='text-gray-400'> {TextDetaills}</p>

                <div className='flex flex-col gap-4 mt-5'>
                    <GroupVariants items={availableSizes} value={String(size)} onClick={(value) => setSize(Number(value) as PizzaSize)} />
                    <GroupVariants items={pizzaTypes} value={String(type)} onClick={(value) => setType(Number(value) as PizzaType)} />
                </div>

                <div className="bg-gray-50 p-5 rounded-md h-[320px] overflow-auto scrollbar mt-5">
                    <div className='grid grid-cols-3 gap-3'>
                        {ingredients.map((ingredient) => (
                            <IngredientItem 
                            imageUrl={ingredient.imageUrl} 
                            key={ingredient.id} 
                            active={selectedIngredients.has(ingredient.id)}
                            onClick={() => addIngredient(ingredient.id)} 
                            name={ingredient.name} 
                            price={ingredient.price} />
                        ))}
                    </div>
                </div>
                <Button onClick={handeleClickAdd} className="h-[55px] px-10 text-base rounded-[18px] w-full mt-10">
                    Add too cart for {totalPrice} €
                </Button>
                {/* <GroupVariants items={[]} /> */}
            </div>
        </div>
    )
}
