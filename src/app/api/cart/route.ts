import { ProductGroup } from "@prisma/client";
import { prisma } from "@/prisma/prisma-client";

import { NextRequest, NextResponse } from "next/server";
import { findOrCreateCart } from "@/src/shared/lib";
import { CreateCartItemValues } from "@/src/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/src/shared/lib/update-cart-total-amount";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    await prisma.cartItem.deleteMany({
      where: {
        cart: { token },
        product: {
          available: false,
        },
      },
    });
    
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
              },
            },
            variation: true,
          },
        },
      },
    });
    const safeUserCart = {
      ...userCart,
      totalAmount: userCart?.totalAmount.toNumber(),
    };
    return NextResponse.json(safeUserCart);
  } catch (error) {
    console.log("[CART_GET] Server error", error);
    return NextResponse.json(
      { message: "Failed to get cart" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let token = req.cookies.get("cartToken")?.value;

    if (!token) {
      token = crypto.randomUUID();
    }

    const userCart = await findOrCreateCart(token);
    const data = (await req.json()) as CreateCartItemValues;
    const findCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: data.productId,
      },
    });

    if (findCartItem) {
      await prisma.cartItem.update({
        where: {
          id: findCartItem.id,
        },
        data: {
          quantity: findCartItem.quantity + data.volume,
        },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: data.productId,
          quantity: data.volume,
          variationId: data.variationId,
        },
      });
    }

    const updatedUserCart = await updateCartTotalAmount(token);

    const resp = NextResponse.json(updatedUserCart);
    resp.cookies.set("cartToken", token, {
      maxAge: 60 * 60 * 24 * 7,
    });

    return resp;
  } catch (error) {
    console.log("[CART_POST] Server error", error);
    return NextResponse.json(
      { message: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
