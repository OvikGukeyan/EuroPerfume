import { prisma } from "@/prisma/prisma-client";
import { updateCartTotalAmount } from "@/shared/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest,  { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 });
        }
        const data = (await req.json()) as { quantity: number };
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Cart token not found!' })
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id
            }
        })

        if (!cartItem) {
            return NextResponse.json({ message: 'Cart item not found!' })
        }

        await prisma.cartItem.update({
            where: {
                id
            },
            data: {
                quantity: data.quantity
            }
        })

        const updatedUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updatedUserCart)
    } catch (error) {
        console.log('[CART PATCH] Server error', error);
        return NextResponse.json({ message: 'Faild to update the cart' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest,  { params }: { params: { id: string } }) {
    try {
        const id = Number(params.id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid cart item ID' }, { status: 400 });
        }
        const token = req.cookies.get('cartToken')?.value;

        if (!token) {
            return NextResponse.json({ message: 'Cart token not found!' })
        }

        const cartItem = await prisma.cartItem.findFirst({
            where: {
                id
            }
        })

        if (!cartItem) {
            return NextResponse.json({ message: 'Cart item not found!' })
        }

        await prisma.cartItem.delete({
            where: {
                id
            },
        })

        const updatedUserCart = await updateCartTotalAmount(token);

        return NextResponse.json(updatedUserCart)

    } catch (error) {
        console.log('[CART DELETE] Server error', error);
        return NextResponse.json({ message: 'Faild to delete the cart item' }, { status: 500 })
    }

}