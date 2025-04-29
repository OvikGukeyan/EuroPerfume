import { calcCartItemTotalPrice } from "@/src/shared/lib";
import { CartItemDTO } from "@/src/shared/services/dto/cart.dto";
import { SafeProduct } from "@/src/shared/services/dto/product.dto";
import { CartItem, OrderItem, Product, ProductVariation } from "@prisma/client";
import * as React from "react";

interface Props {
  orderId: number;
  orderDate: string;
  total: number;
  items: CartItemDTO[];
}

export const OrderSuccessTemplate: React.FC<Props> = ({
  orderId,
  orderDate,
  total,
  items,
}) => (
  <div>
    <h1>Thank you for your purchase!</h1>
    <p>
      Ваш заказ в Euro Perfume успешно оформлен — благодарим вас за доверие и
      отличный выбор!
    </p>

    <h2>Детали заказа:</h2>
    <ul>
      <li>
        Номер: <strong>#EP-{orderId.toString().padStart(6, "0")}</strong>
      </li>
      <li>
        Дата: <strong>{orderDate}</strong>
      </li>
      <li>
        Сумма с доставкой: <strong>€{total.toFixed(2)}</strong>
      </li>
    </ul>

    <p>
      Мы свяжемся с вами в ближайшее время для уточнения деталей и уведомим,
      когда посылка будет передана в службу доставки.
    </p>

    <p>
      <strong>Что дальше?</strong>
      <br />
      • Мы аккуратно упакуем ваш заказ
      <br />
      • Вы получите письмо/SMS с трек-номером
      <br />• Доставка займёт 2–7 рабочих дней, в зависимости от региона
    </p>

    <p>
      Если у вас есть вопросы — просто ответьте на это письмо или свяжитесь с
      нами по почте:
      <br />
      <a href="mailto:europerfumeshop@gmail.com">europerfumeshop@gmail.com</a>
    </p>

    <p>
      Также вы можете написать нам в мессенджере по указанному номеру при
      оформлении.
    </p>

    <hr />

    <h3>Состав заказа:</h3>
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.product.name} | {item.variation?.name} × {item.quantity} ={" "}
          <strong>{calcCartItemTotalPrice(item)} €</strong>
        </li>
      ))}
    </ul>

    <p style={{ marginTop: "2rem" }}>
      С любовью к ароматам,
      <br />
      Ваша команда Euro Perfume
      <br />
      <a href="https://www.euro-perfume.com" target="_blank">
        www.euro-perfume.com
      </a>
    </p>
  </div>
);
