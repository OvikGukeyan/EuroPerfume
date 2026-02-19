import "server-only";
import { prisma } from "@/prisma/prisma-client";
import { calcCartItemTotalPrice } from "../lib/calc-cart-item-total-price";

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
          product: {
            include: {
              productGroup: true,
              brand: true,
            },
          },
          variation: true,
        },
      },
    },
  });

  if (!userCart) {
    return;
  }

  const safeUserCart = {
    ...userCart,
    totalAmount: userCart?.totalAmount.toNumber(),
    items: userCart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
        discountPrice:
          item.product.discountPrice && item.product.discountPrice.toNumber(),
      },
    })),
  };
  const totalAmount = safeUserCart.items.reduce(
    (acc, item) =>
      acc +
      calcCartItemTotalPrice(
        item.product.price,
        item.quantity,
        Boolean(item.product.productGroup?.onTap),
        item.product.discountPrice || undefined
      ),
    0
  );

  const cart = await prisma.cart.update({
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
          product: { include: { productGroup: true, brand: true } },
          variation: true,
        },
      },
    },
  });

  const safeCart = {
    ...cart,
    totalAmount: cart.totalAmount.toNumber(),
    items: cart.items.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
        discountPrice:
          item.product.discountPrice && item.product.discountPrice.toNumber(),
      },
    })),
  };

  return safeCart;
};
