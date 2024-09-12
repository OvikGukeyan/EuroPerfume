"use client"

import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { Title, FilterCheckbox, CheckboxFiltersGroup } from './'
import { Input, RangeSlider } from '../ui'
import { useFilterIngredients } from '@/hooks/useFilterIngredients'

export const Filters = () => {
  const {ingredients, loading} = useFilterIngredients();
  const items = ingredients.map(item => ({value: String(item.id), text: item.name}))

  return (
    <div className={cn('')}>
      <Title text='Filters' className='mb-5 font-bold' />

      <div className='flex flex-col gap-4'>
        <FilterCheckbox text='Can be assembled' value='1' />
        <FilterCheckbox text='New' value='2' />
      </div>

      <div className="mt-10 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={5000}
          />
          <Input
            type="number"
            min={100}
            max={5000}
            placeholder="5000"
          />
        </div>
        <RangeSlider
          min={0}
          max={5000}
          step={10}
          value={[0, 5000]}

        />
      </div>

      <CheckboxFiltersGroup
        title='Ingredients'
        className='mt-50'
        limit={6}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
      />
    </div>
  )
}
