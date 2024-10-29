import React, { FC } from 'react'
import { WhiteBlock } from './white-block'
import { OrderDetails } from './order-details'
import { ArrowRight, Package, Percent, Truck } from 'lucide-react'
import { Button } from '../ui'

interface Props {
    className?: string;
    totalAmount: number;
   
}

const VAT = 15;
const DELIVERY_PRICE = 5;

export const CheckoutSidebar: FC<Props> = ({ className, totalAmount}) => {

    const vatPrice = totalAmount * VAT / 100;
    const deliveryPrice = totalAmount > 0 ? DELIVERY_PRICE : 0;
    const totalPrice = totalAmount + vatPrice + deliveryPrice;
    
    return (
        <WhiteBlock className='p-6 sticky top-4'>
            <div className="flex flex-col gap-1">
                <span className="text-xl">Total price:</span>
                <span className="text-[34px] font-extrabold">{totalPrice} €</span>
            </div>

            <OrderDetails title={
                <div className="flex items-center">
                    <Package size={18} className="mr-2 text-gray-400" />
                    Order price
                </div>

            }
                value={totalAmount + ''} />

            <OrderDetails title={
                <div className="flex items-center">
                    <Percent size={18} className="mr-2 text-gray-400" />
                    Fees
                </div>
            } value={vatPrice + ''} />

            <OrderDetails title={
                <div className="flex items-center">
                    <Truck size={18} className="mr-2 text-gray-400" />
                    Delivery
                </div>
            } value={deliveryPrice + ''} />

            <Button
                type="submit"
                // disabled={!totalAmount || submitting}
                className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
                Move to payment
                <ArrowRight className="w-5 ml-2" />
            </Button>
        </WhiteBlock>
    )
}
