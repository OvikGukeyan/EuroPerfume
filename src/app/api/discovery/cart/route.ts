import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { validDiscoveryIds } from "@/src/shared/server-lib/discovery-catalog";
import { calcCartItemTotalPrice } from "@/src/shared/lib/calc-cart-item-total-price";

export async function POST(req: NextRequest) {
  if (req.headers.get("origin") !== req.nextUrl.origin) return NextResponse.json({ error: "Недопустимый источник запроса." }, { status: 403 });
  let body;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 }); }
  if (!validDiscoveryIds(body?.ids) || !Array.isArray(body?.prices) || body.prices.length !== 8 || body.prices.some((p: unknown) => typeof p !== "number" || !Number.isFinite(p) || p <= 0)) return NextResponse.json({ error: "Выберите восемь разных ароматов." }, { status: 400 });
  const ids: number[] = body.ids;
  const token = req.cookies.get("cartToken")?.value || crypto.randomUUID();
  if (token.length > 128) return NextResponse.json({ error: "Некорректная корзина." }, { status: 400 });
  try {
    const result = await prisma.$transaction(async tx => {
      // Serialize repeats for this anonymous cart; a double click must not add a second box.
      await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtext(${token}))`;
      const products = await tx.product.findMany({ where: { id: { in: ids }, available: true, productGroup: { onTap: true } } });
      if (products.length !== 8 || products.some(p => Number(p.discountPrice || p.price) <= 0)) return { status: 409, error: "Один из ароматов больше недоступен. Вернитесь к подбору и замените его." };
      const prices = ids.map(id => { const p = products.find(p => p.id === id)!; return { id, price: calcCartItemTotalPrice(Number(p.price), 2, true, Number(p.discountPrice) || undefined) }; });
      if (prices.some((p, i) => Math.round(p.price * 100) !== Math.round(body.prices[i] * 100))) return { status: 409, error: "Цены изменились. Проверьте новую сумму и подтвердите переход ещё раз.", products: prices };
      let cart = await tx.cart.findFirst({ where: { token }, include: { items: true } });
      if (!cart) cart = await tx.cart.create({ data: { token }, include: { items: true } });
      const existingSet = ids.every(id => cart!.items.some(i => i.productId === id && i.quantity === 2 && !i.variationId));
      if (!existingSet) await tx.cartItem.createMany({ data: ids.map(productId => ({ cartId: cart!.id, productId, quantity: 2 })) });
      const items = await tx.cartItem.findMany({ where: { cartId: cart.id }, include: { product: { include: { productGroup: true } } } });
      const totalAmount = items.reduce((sum, i) => sum + calcCartItemTotalPrice(Number(i.product.price), i.quantity, Boolean(i.product.productGroup.onTap), Number(i.product.discountPrice) || undefined), 0);
      await tx.cart.update({ where: { id: cart.id }, data: { totalAmount: Math.round(totalAmount * 100) / 100 } });
      return { status: 200, success: true };
    }, { timeout: 15000 });
    const response = NextResponse.json(result, { status: result.status, headers: { "Cache-Control": "no-store" } });
    if (result.status === 200) {
      const options = { httpOnly: true, secure: req.nextUrl.protocol === "https:", sameSite: "lax" as const, path: "/", maxAge: 604800 };
      response.cookies.set("cartToken", token, options);
      response.cookies.set("discoveryBoxIds", ids.join(","), options);
    }
    return response;
  } catch { return NextResponse.json({ error: "Не удалось подготовить корзину. Попробуйте ещё раз." }, { status: 503 }); }
}
