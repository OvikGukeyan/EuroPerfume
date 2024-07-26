import { cn } from '@/lib/utils'
import React from 'react'
import { Title, FilterCheckbox } from './'
import { Input, RangeSlider } from '../ui'

export const Filters = () => {
  return (
    <div className={cn('')}>
        <Title text='Filters' className='mb-5 font-bold'/>

        <div className='flex flex-col gap-4'>
            <FilterCheckbox text='Can be assembled' value='1'/>
            <FilterCheckbox text='New' value='2'/>
        </div>

        <div className="mt-10 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={30000}
          />
          <Input
            type="number"
            min={100}
            max={30000}
            placeholder="30000"
          />
        </div>
        <RangeSlider
          min={0}
          max={1000}
          step={10}
          value={[0, 1000]}
        />
      </div>
    </div>
  )
}
 