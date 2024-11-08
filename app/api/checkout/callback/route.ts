import { prisma } from '@/prisma/prisma-client';
import { OrderSuccessTemplate, PayOrderTemplate } from '@/shared/components';
import { sendEmail } from '@/shared/lib/send-email';
import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import { OrderStatus } from '@prisma/client';
import { error } from 'console';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-10-28.acacia',
});

// Конфигурация для выполнения на Node.js и отключения кеширования
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const sig = req.headers.get('stripe-signature');

    let event;

    // Чтение необработанного тела запроса
    const rawBody = await req.text();

    try {
        // Проверка подписи Webhook
        event = stripe.webhooks.constructEvent(
            rawBody,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error('Ошибка проверки подписи Webhook:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Обработка события успешного платежа
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;
        const customerEmail = session.customer_details?.email as string;

        const order = await prisma.order.findFirst({
            where: {
                id: Number(orderId),
            },
        })
        
        if(!order){
            return NextResponse.json({ error: 'Order not found' });
        }

        // Обновление статуса заказа в базе данных
        await prisma.order.update({
            where: {
                id: Number(orderId),
            },
            data: {
                status: OrderStatus.SUCCEEDED,
            },
        });


        const items = order?.items as unknown as CartItemDTO[];

        await sendEmail(customerEmail, 'Order success', OrderSuccessTemplate({
            orderId: order.id,
            items
        }))
    }

    return NextResponse.json({ received: true });
}

// Пример функции для обновления заказа в базе данных


