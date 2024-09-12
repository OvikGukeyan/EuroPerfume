"use client"
import React, { useState } from 'react'
import { FilterCheckbox, FilterCheckboxProps } from './filter-checkbox';
import { Skeleton } from '../ui/skeleton';

type Item = FilterCheckboxProps;

interface Props {
    title: string;
    items: Item[];
    defaultItems: Item[];
    limit?: number;
    searchInputPlaceholder?: string;
    className?: string;
    selectedIds?: Set<string>;
    onClickCheckbox?: (value: string) => void;
    loading?: boolean;
    name?: string;

}

export const CheckboxFiltersGroup: React.FC<Props> = (
    {
        title,
        items,
        defaultItems,
        limit = 5,
        searchInputPlaceholder = 'Search...',
        className,
        selectedIds,
        onClickCheckbox,
        loading,
        name,
    }) => {

    const [showAll, setShowAll] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const onChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value)
    }

    if (loading) {
        return <div className={className}>
            <p className='font-bold mb-3'>{title}</p>
            {...Array(limit).fill(0).map((_, index) =>
                <Skeleton key={index} className='h-6 mb-6 rounded-[8px]' />
            )}
        </div>
    }

    const list = showAll ? items.filter(item => item.text.toLowerCase().includes(searchValue.toLowerCase())) : defaultItems.slice(0, limit)

    return (
        <div className={className}>
            <p className='font-bold mb-3'>{title}</p>

            {showAll &&
                <div className='mb-5'>
                    <input value={searchValue} onChange={e => onChangeSearchInput(e)} placeholder={searchInputPlaceholder} className='bg-gray-50 border-none' />
                </div>
            }

            <div className='flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar'>
                {list.map((item, index) => (
                    <FilterCheckbox
                        onCheckedChange={() => onClickCheckbox?.(item.value)}
                        checked={selectedIds?.has(item.value)}
                        key={String(item.value)}
                        value={item.value}
                        text={item.text}
                        endAdornment={item.endAdornment}
                        name={name}

                    />
                ))}
            </div>

            {items.length > limit && (
                <div className={showAll ? 'border-t border-t-neutral-100 mt-4' : ''}>
                    <button onClick={() => setShowAll(!showAll)} className="text-primary mt-3">
                        {showAll ? 'Hide' : '+  Show all'}
                    </button>
                </div>
            )}
        </div>
    )
}
