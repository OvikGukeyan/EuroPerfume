import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/prisma/prisma-client";
import {
  calcCartItemTotalPrice,
  calcTotlalAmountWithDelivery,
} from "@/src/shared/lib";

const PatchBodySchema = z.object({
  delta: z
    .number()
    .int()
    .refine((v) => v === 1 || v === -1),
});

const PostBodySchema = z.object({
  orderId: z.number().int().positive(),
  productId: z.number().int().positive(),
  variationId: z.number().int().positive().optional(),
  quantity: z.number().int().positive().default(1), // можно всегда слать 1
});

export type AddOrderItemBody = z.infer<typeof PostBodySchema>;

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const orderItemId = Number(id);

  const parsed = PatchBodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid body" },
      { status: 400 }
    );
  }

  try {
    const data = await prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({
        where: { id: orderItemId },
        include: { product: { include: { productGroup: true } } },
      });
      if (!item) throw new Error("ITEM_NOT_FOUND");

      // (опционально) запрет редактирования если уже отправлен
      const order = await tx.order.findUnique({ where: { id: item.orderId } });
      if (!order) throw new Error("ORDER_NOT_FOUND");
      // if (order.trackingCode) throw new Error("ORDER_ALREADY_SHIPPED");

      const newQty = item.quantity + parsed.data.delta;

      if (newQty <= 0) {
        // можно либо запретить, либо автоматически удалить позицию
        await tx.orderItem.delete({ where: { id: orderItemId } });
      } else {
        await tx.orderItem.update({
          where: { id: orderItemId },
          data: { quantity: newQty },
        });
      }

      // пересчёт totals
      const updated = await tx.order.findUnique({
        where: { id: item.orderId },
        include: {
          items: { include: { product: { include: { productGroup: true } } } },
        },
      });
      if (!updated) throw new Error("ORDER_NOT_FOUND");

      let subtotal = 0;
      for (const it of updated.items)
        subtotal += calcCartItemTotalPrice(
          Number(it.product.price),
          it.quantity,
          Boolean(it.product.productGroup?.onTap),
          Number(it.product.discountPrice) || undefined
        );

      const totalAmountWithDelivery = calcTotlalAmountWithDelivery(
        subtotal,
        updated.country,
        updated?.discount || undefined
      ).totalAmountWithDelivery;

      await tx.order.update({
        where: { id: updated.id },
        data: { totalAmount: Number(totalAmountWithDelivery) },
      });

      return {
        orderId: updated.id,
        subtotal,
        totalAmount: Number(totalAmountWithDelivery),
        itemsCount: updated.items.length,
      };
    });

    return NextResponse.json({ ok: true, ...data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e.message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const orderItemId = Number(id);

  if (!orderItemId) {
    return NextResponse.json(
      { ok: false, message: "Invalid orderItem id" },
      { status: 400 }
    );
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.orderItem.findUnique({
        where: { id: orderItemId },
      });
      if (!item) throw new Error("ITEM_NOT_FOUND");

      const order = await tx.order.findUnique({
        where: { id: item.orderId },
        include: {
          items: {
            include: { product: { include: { productGroup: true } } },
          },
        },
      });
      if (!order) throw new Error("ORDER_NOT_FOUND");

      // (опционально) запрет, если заказ уже отправлен
      // if (order.trackingCode) throw new Error("ORDER_ALREADY_SHIPPED");

      // удаляем позицию
      await tx.orderItem.delete({ where: { id: orderItemId } });

      // пересчёт totals
      const remainingItems = order.items.filter((i) => i.id !== orderItemId);

      let subtotal = 0;
      for (const it of remainingItems) {
        subtotal += calcCartItemTotalPrice(
          Number(it.product.price),
          it.quantity,
          Boolean(it.product.productGroup?.onTap),
          Number(it.product.discountPrice) || undefined
        );
      }

      const totalAmount = calcTotlalAmountWithDelivery(
        subtotal,
        order.country,
        order?.discount || undefined
      ).totalAmountWithDelivery;

      await tx.order.update({
        where: { id: order.id },
        data: {
          totalAmount,
        },
      });

      return {
        orderId: order.id,
        subtotal,
        totalAmount,
        itemsCount: remainingItems.length,
      };
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e.message },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  const parsed = PostBodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid body" },
      { status: 400 }
    );
  }

  const { orderId, productId, variationId, quantity } = parsed.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) заказ
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });
      if (!order) throw new Error("ORDER_NOT_FOUND");

      // запрет редактирования после отправки/закрытия (по желанию)
      // if (order.trackingCode) throw new Error("ORDER_ALREADY_SHIPPED");
      // if (order.status === "SUCCEEDED" || order.status === "CENCELLED") throw new Error("ORDER_LOCKED");

      // 2) продукт (и вариация, если есть)
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { productGroup: true },
      });
      if (!product) throw new Error("PRODUCT_NOT_FOUND");
      if (product.available === false) throw new Error("PRODUCT_NOT_AVAILABLE");

      if (variationId) {
        const v = await tx.productVariation.findFirst({
          where: { id: variationId, productId },
          select: { id: true },
        });
        if (!v) throw new Error("VARIATION_NOT_FOUND");
      }

      // 3) Если такая позиция уже есть — увеличиваем qty, иначе создаём
      const existing = await tx.orderItem.findFirst({
        where: {
          orderId,
          productId,
          variationId: variationId ?? null,
        },
        select: { id: true, quantity: true },
      });

      if (existing) {
        await tx.orderItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + quantity },
        });
      } else {
        await tx.orderItem.create({
          data: {
            orderId,
            productId,
            variationId: variationId ?? null,
            quantity,
            name: product.name,
          },
        });
      }

      // 4) пересчитываем totalAmount
      const updated = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          items: { include: { product: { include: { productGroup: true } } } },
        },
      });
      if (!updated) throw new Error("ORDER_NOT_FOUND");

      let subtotal = 0;
      for (const it of updated.items)
        subtotal += calcCartItemTotalPrice(
          Number(it.product.price),
          it.quantity,
          Boolean(it.product.productGroup?.onTap),
          Number(it.product.discountPrice) || undefined
        );

      const totalAmount = calcTotlalAmountWithDelivery(
        subtotal,
        order.country,
        order?.discount || undefined
      ).totalAmountWithDelivery;

      await tx.order.update({
        where: { id: orderId },
        data: { totalAmount },
      });

      return updated
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Unknown error" },
      { status: 400 }
    );
  }
}
