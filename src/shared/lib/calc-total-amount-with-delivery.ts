import { deliveryTypes } from "@/../../prisma/constants";;
import { DeliveryTypes } from "@prisma/client";

export const calcTotlalAmountWithDelivery = (totlalAmount: number, delivery: DeliveryTypes, discount?: number) => {
    let totalAmountWithDelivery = 0;
    let deliveryPrice = 0;
    const totalAmountWithDiscount = discount ? totlalAmount - totlalAmount * (discount / 100) : totlalAmount;
    if(totalAmountWithDiscount < 100 && totalAmountWithDiscount > 0) {
        deliveryPrice = deliveryTypes.find((type) => type.value === delivery)?.price || 0;
        totalAmountWithDelivery = Number(totalAmountWithDiscount) + deliveryPrice;
    }else {
        totalAmountWithDelivery = Number(totalAmountWithDiscount);
    }
    return {totalAmountWithDelivery, deliveryPrice}
}