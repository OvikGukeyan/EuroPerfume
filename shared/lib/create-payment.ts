import Stripe from "stripe";


interface Props {
    amount: number;
    orderId: number;
    description: string;
}
export const createPayment = async (data: Props) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
        apiVersion: "2024-10-28.acacia",
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: data.description,
                    },
                    unit_amount: Math.round(data.amount * 100),
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?paid`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?faild`,
        metadata: {
            order_id: data.orderId, 
        },
    });

    return session
}
 