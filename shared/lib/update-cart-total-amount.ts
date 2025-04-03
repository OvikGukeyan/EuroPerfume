import { prisma } from "@/prisma/prisma-client";
import { calcCartItemTotalPrice } from "./calc-cart-item-total-price";

export const updateCartTotalAmount = async (token: string) => {
  const userCart = await prisma.cart.findFirst({
    where: {
      token,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: true,
          variation: true,
        },
      },
    },
  });

  if (!userCart) {
    return;
  }

  //   const totalAmount = userCart.items.reduce(
  //     (acc, item) => acc + calcCartItemTotalPrice(item),
  //     0
  //   );
  const totalAmount = userCart.items.reduce(
    (acc, item) =>
      acc + calcCartItemTotalPrice({ ...item, product: item.product!, variation: item.variation ?? undefined  }),
    0
  );

  return await prisma.cart.update({
    where: {
      id: userCart.id,
    },
    data: {
      totalAmount,
    },
    include: {
      items: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          product: true,
          variation: true,
        },
      },
    },
  });
};
