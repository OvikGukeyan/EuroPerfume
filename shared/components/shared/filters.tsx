"use client"

import { cn } from '@/shared/lib/utils';
import React, { FC } from 'react';
import { Title, CheckboxFiltersGroup } from '.';
import { Input, RangeSlider } from '../ui';
import { useFilters, useIngredients, useQueryFilters } from '@/shared/hooks';

interface Props {
  className?: string
}



export const Filters: FC<Props> = () => {
  const { loading, ingredients } = useIngredients();
  const filters = useFilters()

  const items = ingredients.map(item => ({ value: String(item.id), text: item.name }));

  useQueryFilters(filters)

  const updatePreces = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0])
    filters.setPrices('priceTo', prices[1])
  }



  return (
    <div className={cn('')}>
      <Title text='Filters' className='mb-5 font-bold' />

      <CheckboxFiltersGroup
        title='Pizza Types'
        name='types'
        className='mb-5'
        onClickCheckbox={filters.setPizzaTypes}
        selected={filters.pizzaTypes}
        items={[
          { text: 'Thin', value: '1' },
          { text: 'Normal', value: '2' },
        ]}
      />

      <CheckboxFiltersGroup
        title='Sizes'
        name='sizes'
        className='mb-5'
        onClickCheckbox={filters.setSizes}
        selected={filters.sizes}
        items={[
          { text: '20 sm', value: '20' },
          { text: '30 sm', value: '30' },
          { text: '40 sm', value: '40' },
        ]}
      />

      <div className="mt-10 pb-7">
        <p className="font-bold mb-3">Price from to:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={50}
            value={String(filters.prices.priceFrom)}
            onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            min={100}
            max={50}
            placeholder="50"
            value={String(filters.prices.priceTo)}
            onChange={(e) => filters.setPrices('priceTo', Number(e.target.value))}
          />
        </div>
        <RangeSlider
          min={0}
          max={50}
          step={1}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 50]}
          onValueChange={updatePreces}

        />
      </div>

      <CheckboxFiltersGroup
        title='Ingredients'
        className='mt-50'
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
        name='ingredients'
      />
    </div>
  )
}
