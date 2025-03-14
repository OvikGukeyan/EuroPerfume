import React, { FC } from 'react'
import { Categories, SortPopup, Container, SearchInput } from '.'
import { cn } from '@/shared/lib/utils'
import { Category } from '@prisma/client'

interface Props {
    className?: string
    categories: Category[]
}

export const TopBar: FC<Props> = ({ className, categories }) => {
    return (
        <div className={cn('sticky top-7 bg-white py-5 shadow-lg shadow-black/5 z-10 ')}>
            <Container className="flex flex-col gap-5 items-center justify-between md:flex-row ">
                <Categories items={categories} />

                <div className='flex w-full md:w-auto justify-between gap-5'>
                    <div className='md:hidden w-full'>
                        <SearchInput />
                    </div>

                    <SortPopup />
                </div>
            </Container>
        </div>
    )
}
