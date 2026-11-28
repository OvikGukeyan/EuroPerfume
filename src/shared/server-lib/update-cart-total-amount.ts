import "server-only";
import { getCartPromotions, promotionQualified, promotionLive } from "./promotions";
import { cookies } from "next/headers";
import { aromaBoxItems } from "../lib/aroma-box";
import { sumMoney } from "../lib/money";
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
  const totalAmount = sumMoney(safeUserCart.items.map(
    (item) =>
      calcCartItemTotalPrice(
        item.product.price,
        item.quantity,
        Boolean(item.product.productGroup?.onTap),
        item.product.discountPrice || undefined,
        item.product, Date.now(), true, item.packMl
      )
  ));

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

  const cartCampaigns = await getCartPromotions(cart.id);
  const promoSummaries = cartCampaigns.map(({promotion})=>({
    id:promotion.id, slug:promotion.slug, titleRu:promotion.titleRu, titleDe:promotion.titleDe,
    giftMl:promotion.giftMl,requiredMl:promotion.requiredMl,productIds:promotion.productIds, eligible:promotionLive(promotion) && promotionQualified(promotion,cart.items),
    giftProductId:promotion.giftProductId
  }));
  const giftProducts=await prisma.product.findMany({where:{id:{in:promoSummaries.map(p=>p.giftProductId).filter((id):id is number=>id!==null)}}});
  const promotions=promoSummaries.map(p=>({
    ...p,
    eligible:p.eligible && Boolean(giftProducts.find(g=>g.id===p.giftProductId && g.available && g.bottleParentId===null)),
    giftName:giftProducts.find(g=>g.id===p.giftProductId)?.name||"",
    giftImage:giftProducts.find(g=>g.id===p.giftProductId)?.imageUrl[0]||"",
    giftPrice:(()=>{const g=giftProducts.find(g=>g.id===p.giftProductId);return g?calcCartItemTotalPrice(Number(g.price),p.giftMl,true,g.discountPrice?Number(g.discountPrice):undefined,g):0})(),
  }));
  const box = aromaBoxItems((await cookies()).get("discoveryBoxIds")?.value, cart.items);
  const safeCart = {
    ...cart,
    totalAmount: cart.totalAmount.toNumber(),
    promotions,
    items: cart.items.map((item) => ({
      ...item,
      aromaBox: box.some(b => b.id === item.id),
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
