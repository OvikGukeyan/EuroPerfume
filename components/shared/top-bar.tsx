import React from 'react'
import { Categories, SortPopup, Container } from './'
import { cn } from '@/lib/utils'

export const TopBar = () => {
    return (
        <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10')}>
            <Container className="flex items-center justify-between ">
                <Categories />
                <SortPopup />
            </Container>

        </div>
    )
}
