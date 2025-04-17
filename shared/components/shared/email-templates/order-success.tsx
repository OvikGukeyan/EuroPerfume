import { CartItemDTO } from '@/shared/services/dto/cart.dto';
import * as React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({
  orderId,
  items
}) => (
  <div>
    <h1>Thank you for your purchase!</h1>

    <p> Your order #{orderId} has been successfully placed. Items list:</p>

    <hr />

    <ul>
        {items.map((item) => (
            <li key={item.id}>{item.product.name} | {item.product.name} € * {item.quantity} = {item.product.price.toNumber() * item.quantity} €</li>
        ))}
    </ul>

  </div>
);
