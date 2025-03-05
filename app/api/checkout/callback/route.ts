import { prisma } from '@/prisma/prisma-client';
import { OrderSuccessTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib/send-email';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia',
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');
    let event;

    try {
        // Read the raw request body
        const rawBody = await req.text();

        // Verify the Stripe webhook signature
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle successful payment event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.order_id;
        const customerEmail = session.customer_details?.email as string;
        if (!orderId) {
            console.error('Order ID missing in metadata');
            return NextResponse.json({ error: 'Order ID is missing' }, { status: 400 });
        }


        try {
            // Check if the order exists in the database
            const order = await prisma.order.findFirst({
                where: {
                    id: Number(orderId),
                },
            });

            if (!order) {
                console.error('Order not found:', orderId);
                return NextResponse.json({ error: 'Order not found' }, { status: 404 });
            }

            // Update the order status
            await prisma.order.update({
                where: { id: order.id },
                data: { status: OrderStatus.SUCCEEDED },
            });

            const items = JSON.parse(order.items as string) as CartItemDTO[];

            // Send an email notification
            await sendEmail(customerEmail, 'Payment Success', OrderSuccessTemplate({
                orderId: order.id,
                items
            }))

            console.log('Email sent to:', customerEmail);
        } catch (err: any) {
            console.error('Error updating order or sending email:', err.message);
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
