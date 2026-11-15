import { aromaBoxItems } from "@/src/shared/lib/aroma-box";
import { roundMoney } from "@/src/shared/lib/money";
import { ProductGroup } from "@prisma/client";
import { prisma } from "@/prisma/prisma-client";

import { NextRequest, NextResponse } from "next/server";
import { CreateCartItemValues } from "@/src/shared/services/dto/cart.dto";
import { updateCartTotalAmount } from "@/src/shared/server-lib/update-cart-total-amount";
import { findOrCreateCart } from "@/src/shared/server-lib/find-or-create-cart";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value;

    if (!token) {
      return NextResponse.json({ totalAmount: 0, items: [] });
    }

    const deletedItemsCount = await prisma.cartItem.deleteMany({
      where: {
        cart: { token },
        product: {
          available: false,
        },
      },
    });

    if (deletedItemsCount.count > 0) {
      await updateCartTotalAmount(token);
    }
    
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
    const box = aromaBoxItems(req.cookies.get("discoveryBoxIds")?.value, userCart?.items || []);
    const safeUserCart = {
      ...userCart,
      items: userCart?.items.map(item => ({ ...item, aromaBox: box.some(b => b.id === item.id) })) || [],
      totalAmount: roundMoney(userCart?.totalAmount.toNumber() ?? 0),
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
    if (!Number.isSafeInteger(data.volume) || data.volume<1 || !Number.isSafeInteger(data.productId))
      return NextResponse.json({message:"Invalid quantity or product"},{status:400});
    const ok=await prisma.$transaction(async tx=>{
      await tx.$queryRaw`SELECT id FROM public."Cart" WHERE id=${userCart.id} FOR UPDATE`;
      const product=await tx.product.findUnique({where:{id:data.productId},select:{available:true,bottleParentId:true,stockPieces:true}});
      if(!product?.available || (product.bottleParentId!==null && data.variationId!=null)) return false;
      const existing=await tx.cartItem.findFirst({where:{cartId:userCart.id,productId:data.productId,variationId:data.variationId??null}});
      const quantity=(existing?.quantity??0)+data.volume;
      if(product.bottleParentId!==null && quantity>product.stockPieces) return false;
      if(existing) await tx.cartItem.update({where:{id:existing.id},data:{quantity}});
      else await tx.cartItem.create({data:{cartId:userCart.id,productId:data.productId,quantity,variationId:data.variationId}});
      return true;
    });
    if(!ok) return NextResponse.json({message:"Requested quantity unavailable"},{status:409});

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
