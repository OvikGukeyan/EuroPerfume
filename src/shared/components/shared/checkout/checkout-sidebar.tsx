import React, { FC } from 'react'
import { ArrowRight, Package, Truck } from 'lucide-react'
import { OrderDetails, WhiteBlock } from '..';
import { Button, Skeleton } from '../..';
import { useTranslations } from 'next-intl';

interface Props {
    className?: string;
    loading?: boolean;
    itemLoading?: boolean;
    totalAmount: number;
    deliveryPrice: number;
    totalAmountWithDelivery: number
}


export const CheckoutSidebar: FC<Props> = ({ className, loading, totalAmount, itemLoading, deliveryPrice, totalAmountWithDelivery }) => {

    const t = useTranslations("Checkout.sidebar");

    return (
        <WhiteBlock className='p-2 md:p-6 sticky top-4'>
            <div className="flex flex-col gap-1">
                <span className="text-xl">{t("totalPriceLabel")}</span>
                {loading ? <Skeleton className="h-11 w-40" /> : <span className="h-11 text-[34px] font-extrabold">{totalAmountWithDelivery} €</span>}
            </div>

            <OrderDetails

                title={
                    <div className="flex items-center">
                        <Package size={18} className="mr-2 text-gray-400" />
                        {t("orderPrice")}
                    </div>

                }
                value={
                    loading ?
                        <Skeleton className="h-6 w-16" /> :
                        totalAmount + ' €'
                } />

            

            <OrderDetails

                title={
                    <div className="flex items-center">
                        <Truck size={18} className="mr-2 text-gray-400" />
                        {t("delivery")}
                    </div>
                } value={
                    loading ?
                        <Skeleton className="h-6 w-16" /> :
                        deliveryPrice + ' €'
                } />

            <Button
                loading={loading || itemLoading}
                type="submit"
                disabled={!totalAmount}
                className="w-full h-14 rounded-2xl mt-6 text-base font-bold"
                variant='tertiary'
                >
                {t("submitButton")}
                <ArrowRight className="w-5 ml-2" />
            </Button>
        </WhiteBlock>
    )
}
