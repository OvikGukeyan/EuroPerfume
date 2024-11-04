import React, { FC } from 'react'
import { AdressInput, FormTextarea, WhiteBlock } from '..';
import { cn } from '@/shared/lib/utils';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
    totalAmount: number;
    className?: string;
}
export const CheckoutDeliveryForm: FC<Props> = ({ className, totalAmount }) => {
    const {control: form } = useFormContext()
    return (
        <WhiteBlock
            className={cn(className, !totalAmount ? 'opacity-50 pointer-events-none' : '')}
            title="3. Delivery information"
            contentClassName="p-8">
            <div className="flex flex-col gap-5">
                <Controller
                                control={form}
                                name="address"
                                render={({ field }) => <AdressInput onChange={field.onChange} />}
                            />

                <FormTextarea
                    name="comment"
                    className="text-base"
                    placeholder="Description"
                    rows={5}
                />
            </div>
        </WhiteBlock>
    )
}
