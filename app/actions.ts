"use server"

import { prisma } from "@/prisma/prisma-client";
import { PayOrderTemplate, UserVerificationTemplate } from "@/shared/components";
import { CheckoutFormValues } from "@/shared/constants";
import { createPayment } from "@/shared/lib/create-payment";
import { getUserSession } from "@/shared/lib/get-user-session";
import { sendEmail } from "@/shared/lib/send-email";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
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
                    // include: {
                    //     ingredients: true,
                    //     productItem: {
                    //         include: {
                    //             product: true
                    //         }
                    //     }
                    // }
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

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
    try {
      const currentUser = await getUserSession();
  
      if (!currentUser) {
        throw new Error('User not found');
      }
  
      const findUser = await prisma.user.findFirst({
          where: {
              id: Number(currentUser.id)
          }
      })
      await prisma.user.update({
        where: {
          id: Number(currentUser.id),
        },
        data: {
          fullName: body.fullName,
          email: body.email,
          password: body.password ? hashSync(body.password as string, 10): findUser?.password,
        },
      });
    } catch (error) {
      console.error('Error [UPDATE_USER]', error);
      throw error;
    }
  }


export async function registerUser(body: Prisma.UserCreateInput) {
    try {
        const findUser = await prisma.user.findFirst({
            where: {
                email: body.email,
            }
        })
        
        if(findUser) {
            if(!findUser.verified) {
                throw new Error('User not verified')
            }
            throw new Error('User already exists')
        }

        const createdUser = await prisma.user.create({
            data: {
                email: body.email,
                fullName: body.fullName,
                password: hashSync(body.password, 10),
            }
        })

        const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000).toString();

        await prisma.verificationCode.create({
            data: {
                code,
                userId: createdUser.id
            }
        })

        await sendEmail(
            createdUser.email,
            'Verify your email',
            UserVerificationTemplate({
                code
            })
        )


    } catch (error) {
        console.error('Error [REGISTER_USER]', error);
        throw error;
    }
}

export async function updateUser(id: number, data: Prisma.UserUpdateInput) {
    try {
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...data,
          verified: new Date(),
          ...(data.password && { password: hashSync(String(data.password), 10) }),
        },
      });
    } catch (error) {
      console.log('Error [UPDATE_USER]', error);
      throw error;
    }
  }