import React, { FC } from 'react'
import { Categories, SortPopup, Container } from './'
import { cn } from '@/lib/utils'
import { Category } from '@prisma/client'

interface Props {
    className?: string
    categories: Category[]
}

export const TopBar: FC<Props> = ({className, categories}) => {
    return (
        <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10')}>
            <Container className="flex items-center justify-between ">
                <Categories items={categories}/>
                <SortPopup />
            </Container>

        </div>
    )
}
