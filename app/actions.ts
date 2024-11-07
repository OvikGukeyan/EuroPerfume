"use server"

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment } from "@/shared/lib/create-payment";
import { sendEmail } from "@/shared/lib/send-email";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";


export async function createOrder(data: CheckoutFormValues) {
    try {

        const cookieStore = cookies();
        const cartToken = cookieStore.get('cartToken')?.value;

        if (!cartToken) {
            throw new Error('Cart token not found!')
        }

        const userCart = await prisma.cart.findFirst({
            include: {
                user: true,
                items: {
                    include: {
                        ingredients: true,
                        productItem: {
                            include: {
                                product: true
                            }
                        }
                    }
                }
            },
            where: {
                token: cartToken
            }
        })

        if (!userCart) {
            throw new Error('Cart not found!')
        }

        if (userCart?.totalAmount === 0) {
            throw new Error('Cart is empty!')
        }

        const order = await prisma.order.create({
            data: {
                fullName: data.firstName + " " + data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                comment: data.comment,
                token: cartToken,
                totalAmount: userCart.totalAmount,
                status: OrderStatus.PENDING,
                items: JSON.stringify(userCart.items)
            }
        })

        await prisma.cart.update({
            where: {
                id: userCart.id
            },
            data: {
                totalAmount: 0,
            }

        })

        await prisma.cartItem.deleteMany({
            where: {
                cartId: userCart.id
            }
        })
        const paymentData = await createPayment({
            orderId: order.id,
            amount: order.totalAmount,
            description: 'Order #' + order.id
        })

        if(!paymentData) {
            throw new Error('Failed to create payment')
        }

        await prisma.order.update({
            where: {
                id: order.id
            },
            data: {
                peymentId: paymentData.id,
            }
        })

        await sendEmail(data.email, 'Pay order #' + order.id, PayOrderTemplate({
            orderId: order.id,
            totalAmount: order.totalAmount,
            paymentUrl: paymentData?.url || ''
        }))

        return paymentData.url

    } catch (error) {
        console.log('[createOrder] Server error', error)
    }


}