import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
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
        const customerEmail = session.customer_details?.email;

        console.log(`Оплата успешна! Заказ ID: ${orderId}, Email: ${customerEmail}`);

        // Обновление статуса заказа в базе данных
        await updateOrderStatus(orderId, OrderStatus.SUCCEEDED);
    }

    return NextResponse.json({ received: true });
}

// Пример функции для обновления заказа в базе данных
async function updateOrderStatus(orderId: string | undefined, status: string) {
    if (!orderId) return;
    await prisma.order.update({
        where: {
            id: Number(orderId),
        },
        data: {
            status: OrderStatus.SUCCEEDED,
        },
    });
    // Здесь можно добавить код для обновления в базе данных
}

