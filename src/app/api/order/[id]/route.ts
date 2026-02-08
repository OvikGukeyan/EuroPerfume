import { prisma } from "@/prisma/prisma-client";
import { OrderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
        }
        const data = (await req.json()) as { status: OrderStatus };

       

        const order = await prisma.order.findFirst({
            where: {
                id
            }
        })

        if (!order) {
            return NextResponse.json({ message: 'Order not found!' })
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id
            },
            data: {
                status: data.status
            }
        })

        return NextResponse.json({
            message: 'Order updated',
            status: updatedOrder.status
        })
    } catch (error) {
        console.log('[ORDER PATCH] Server error', error);
        return NextResponse.json({ message: 'Faild to update the order' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id
            }
        })

        if (!order) {
            return NextResponse.json({ message: 'Order not found!' })
        }

        const data = await prisma.order.delete({
            where: {
                id
            },
        })


        return NextResponse.json(data)

    } catch (error) {
        console.log('[ORDER DELETE] Server error', error);
        return NextResponse.json({ message: 'Faild to delete the order' }, { status: 500 })
    }

}

export async function GET(req: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = Number((await params).id);
        if (isNaN(id)) {
            return NextResponse.json({ message: 'Invalid order ID' }, { status: 400 });
        }

        const order = await prisma.order.findFirst({
            where: {
                id
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                productGroup: true
                            }
                        }
                    }
                }
            }
        })

        if (!order) {
            return NextResponse.json({ message: 'Order not found!' })
        }

        return NextResponse.json(order)
    }
    catch (error) {
        console.log('[ORDER GET] Server error', error);
        return NextResponse.json({ message: 'Faild to get the order' }, { status: 500 })
    }
}