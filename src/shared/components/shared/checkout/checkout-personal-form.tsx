import React, { FC } from 'react'
import { FormInput, RadioInput, Title, WhiteBlock } from '..'
import { cn } from '@/src/shared/lib/utils';
import { contactForms } from "@/../../prisma/constants";;

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
                <div>
                    <Title text="Contact form" size="xs" className="mb-3" />
                <RadioInput name="contactForm" items={contactForms}/>
                </div>
            </div>
        </WhiteBlock>
    )
}
