import React, { FC } from 'react'
import { FormInput, WhiteBlock } from '..'
import { Input } from '../../ui'
import { cn } from '@/shared/lib/utils';

interface Props {
    totalAmount: number;
    className?: string;
}
export const CheckoutPersonalForm: FC<Props> = ({ className, totalAmount }) => {
    return (
        <WhiteBlock
            title="2. Personal Information"
            className={cn(className, !totalAmount ? 'opacity-50 pointer-events-none' : '')}
            contentClassName="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput name="firstName" className="text-base" placeholder="First Name" />
                <FormInput name="lastName" className="text-base" placeholder="Last Name" />
                <FormInput name="email" className="text-base" placeholder="E-Mail" />
                <FormInput name="phone" className="text-base" placeholder="Phone" />
            </div>
        </WhiteBlock>
    )
}
