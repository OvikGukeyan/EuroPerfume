import React, { FC } from 'react'
import { WhiteBlock } from '..';
import { Textarea } from '../../ui';
import { cn } from '@/shared/lib/utils';

interface Props {
    totalAmount: number;
    className?: string;
}
export const CheckoutDeliveryForm: FC<Props> = ({ className, totalAmount }) => {
    return (
        <WhiteBlock
            className={cn(className, !totalAmount ? 'opacity-50 pointer-events-none' : '')}
            title="3. Delivery information"
            contentClassName="p-8">
            <div className="flex flex-col gap-5">
                {/* <Controller
                                control={form.control}
                                name="address"
                                render={({ field }) => <AdressInput onChange={field.onChange} />}
                            /> */}

                <Textarea
                    name="comment"
                    className="text-base resize-none"
                    placeholder="Description"
                    rows={5}

                />
            </div>
        </WhiteBlock>
    )
}
