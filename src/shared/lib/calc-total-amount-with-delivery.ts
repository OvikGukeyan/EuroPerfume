import { deliveryTypes } from "@/../../prisma/constants";;
import { DeliveryTypes } from "@prisma/client";

export const calcTotlalAmountWithDelivery = (totlalAmount: number, delivery: DeliveryTypes) => {
    let totalAmountWithDelivery = 0;
    let deliveryPrice = 0;
    if(totlalAmount < 100 && totlalAmount > 0) {
        deliveryPrice = deliveryTypes.find((type) => type.value === delivery)?.price || 0;
        totalAmountWithDelivery = Number(totlalAmount) + deliveryPrice;
    }else {
        totalAmountWithDelivery = Number(totlalAmount);
    }
    return {totalAmountWithDelivery, deliveryPrice}
}