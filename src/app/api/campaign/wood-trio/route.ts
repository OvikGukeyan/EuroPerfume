import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { findOrCreateCart } from "@/src/shared/server-lib/find-or-create-cart";
import { updateCartTotalAmount } from "@/src/shared/server-lib/update-cart-total-amount";

export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("cartToken")?.value || crypto.randomUUID();
    const cart = await findOrCreateCart(token);
    const result = await prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT id FROM public."Cart" WHERE id=${cart.id} FOR UPDATE`;
      const candidates = await tx.product.findMany({
        where: {
          bottleParentId: null, available: true,
          OR: [
            { name: { equals: "Cedar Chic", mode: "insensitive" } },
            { name: { contains: "Bois Imp", mode: "insensitive" } },
            { name: { equals: "Encre Noire", mode: "insensitive" } },
          ],
        },
        include: { productGroup: true },
      });
      const canonical = (name: string) => name.trim().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase();
      const find = (name: string) => candidates.find(p => canonical(p.name) === canonical(name) && p.productGroup.onTap);
      const cedar = find("Cedar Chic"), bois = find("Bois Impérial"), gift = find("Encre Noire");
      if (!cedar || !bois || !gift) return false;
      for (const product of [cedar, bois]) {
        const lines = await tx.cartItem.findMany({ where: { cartId: cart.id, productId: product.id, variationId: null } });
        if (lines.length) {
          const first = lines[0];
          if (first.quantity < 5) await tx.cartItem.update({ where: { id: first.id }, data: { quantity: 5 } });
        } else {
          await tx.cartItem.create({data: {cartId: cart.id, productId: product.id, quantity: 5}});
        }
      }
      return true;
    });
    if (!result) return NextResponse.json({message:"Campaign unavailable"}, {status:409});
    const updated = await updateCartTotalAmount(token);
    const response = NextResponse.json(updated, {headers: {"Cache-Control":"no-store"}});
    response.cookies.set("cartToken",token,{maxAge:60*60*24*7, sameSite:"lax", path:"/"});
    return response;
  } catch (error) {
    console.error("[WOOD_TRIO_POST]",error);
    return NextResponse.json({message:"Could not add campaign set"},{status:500});
  }
}
