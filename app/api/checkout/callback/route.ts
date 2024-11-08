import { prisma } from '@/prisma/prisma-client';
import { OrderStatus } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-10-28.acacia',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

// Функция для чтения необработанного тела запроса
const getRawBody = async (req: NextApiRequest) => {
  const chunks: any[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).send('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Ошибка проверки подписи Webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка события успешного платежа
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('Оплата прошла успешно:', session);

    // Извлекаем информацию из сессии
    const orderId = session.metadata?.orderId;
    const customerEmail = session.customer_details?.email;

    // Выполните обновление вашего заказа в базе данных здесь
    await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        status: OrderStatus.SUCCEEDED,
      },
    });

    console.log(`Заказ ${orderId} был успешно оплачен клиентом ${customerEmail}`);
  }

  res.status(200).json({ received: true });
}
