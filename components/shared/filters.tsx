import { cn } from '@/lib/utils'
import React from 'react'
import { Title, FilterCheckbox, CheckboxFiltersGroup } from './'
import { Input, RangeSlider } from '../ui'

export const Filters = () => {
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
        defaultItems={[
          { text: 'Chese sous', value: '1' },
          { text: 'Pepperoni', value: '2' },
          { text: 'Mushrooms', value: '3' },
          { text: 'Olives', value: '4' },
          { text: 'Green Peppers', value: '5' },
          { text: 'Onions', value: '6' }
        ]}
        items={[
          { text: 'Chese sous', value: '1' },
          { text: 'Pepperoni', value: '2' },
          { text: 'Mushrooms', value: '3' },
          { text: 'Olives', value: '4' },
          { text: 'Green Peppers', value: '5' },
          { text: 'Onions', value: '6' },
          { text: 'Bacon', value: '7' },
          { text: 'Tomatoes', value: '8' },
          { text: 'Pineapple', value: '9' },
          { text: 'Ham', value: '10' },
          { text: 'Spinach', value: '11' },
          { text: 'Jalapenos', value: '12' }
        ]}
      />
    </div>
  )
}
