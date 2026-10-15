import { formatMoney } from "@/src/shared/lib/money";
import * as React from 'react';

interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
}

export const PayOrderTemplate: React.FC<Props> = ({
  orderId,
  totalAmount,
  paymentUrl
}) => (
  <div>
    <h1>Order #{orderId}</h1>

    <p> Click on the <a href={paymentUrl}>link</a> to pay {formatMoney(totalAmount)} € for your order  <a></a></p>

  </div>
);
