"use client"

import { cn } from '@/lib/utils'
import React, { FC, useState } from 'react'
import { Title, FilterCheckbox, CheckboxFiltersGroup } from './'
import { Input, RangeSlider } from '../ui'
import { useFilterIngredients } from '@/hooks/useFilterIngredients'
import { useSet } from 'react-use'

interface Props {
  className?: string
}

interface PriceProps {
  priceFrom: number
  priceTo: number
}
export const Filters:FC<Props> = () => {
  const {ingredients, loading, onAddId, selectedIngredients} = useFilterIngredients();
  const items = ingredients.map(item => ({value: String(item.id), text: item.name}));
  const [prices, setPrice] = useState<PriceProps>({priceFrom: 0, priceTo: 1000});

  const [sizes, { toggle: toggleSizes }] = useSet(new Set<string>([]));
  const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(new Set<string>([]));



  const updatePrice = (name: keyof PriceProps, value: number) => {
    setPrice({...prices, [name]: value})
  }

  return (
    <div className={cn('')}>
      <Title text='Filters' className='mb-5 font-bold' />

      <CheckboxFiltersGroup
          title='Pizza Types'
          name='types'
          className='mb-5'
          onClickCheckbox={togglePizzaTypes}
          selected={pizzaTypes}
          items={[
            {text: 'Thin', value: '1'},
            {text: 'Normal', value: '2'},
          ]}
        />

        <CheckboxFiltersGroup
          title='Sizes'
          name='sizes'
          className='mb-5'
          onClickCheckbox={toggleSizes}
          selected={sizes}
          items={[
            {text: '20 sm', value: '20'},
            {text: '30 sm', value: '30'},
            {text: '40 sm', value: '40'},
          ]}
        />

      <div className="mt-10 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={5000}
            value={String(prices.priceFrom)}
            onChange={(e) => updatePrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={100}
            max={5000}
            placeholder="5000"
            value={String(prices.priceTo)}
            onChange={(e) => updatePrice('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[prices.priceFrom, prices.priceTo]}
          onValueChange={([priceFrom, priceTo]) => setPrice({priceFrom, priceTo})}

        />
      </div>

      <CheckboxFiltersGroup
        title='Ingredients'
        className='mt-50'
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selected={selectedIngredients}
        name='ingredients'
      />
    </div>
  )
}
