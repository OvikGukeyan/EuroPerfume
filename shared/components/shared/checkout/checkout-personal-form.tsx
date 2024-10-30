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
            title="2. Персональная информация"
            className={cn(className, !totalAmount ? 'opacity-50 pointer-events-none' : '')}
            contentClassName="p-8">
            <div className="grid grid-cols-2 gap-5">
                <Input name="firstName" className="text-base" placeholder="Имя" />
                <Input name="lastName" className="text-base" placeholder="Фамилия" />
                <Input name="email" className="text-base" placeholder="E-Mail" />
                <FormInput name="phone" className="text-base" placeholder="Телефон" />
            </div>
        </WhiteBlock>
    )
}
