import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { getUserSession } from "@/src/shared/server-lib/get-user-session";
import { updatePreinvoiceOrder,lockEditableOrder } from "@/src/shared/server-lib/preinvoice-loyalty";
import { prisma } from "@/prisma/prisma-client";


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
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  if (req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({ok:false,message:"ORIGIN"},{status:403});
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
        include: { product: { include: { productGroup: true, brand: true } } },
      });
      if (!item) throw new Error("ITEM_NOT_FOUND");

      const order = await lockEditableOrder(tx,item.orderId);
      const lockedItem=await tx.orderItem.findUnique({where:{id:orderItemId}});
      if(!lockedItem)throw Error("ITEM_NOT_FOUND");

      const newQty = lockedItem.quantity + parsed.data.delta;

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
          items: { include: { product: { include: { productGroup: true, brand: true } } } },
        },
      });
      if (!updated) throw new Error("ORDER_NOT_FOUND");

      const pricing = await updatePreinvoiceOrder(tx,order,updated.items);
      const subtotal = pricing.subtotalGrossCents / 100;
      const totalAmountWithDelivery = pricing.totalGrossCents / 100;


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
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  if (req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({ok:false,message:"ORIGIN"},{status:403});
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


      const order=await lockEditableOrder(tx,item.orderId);
      const locked=await tx.orderItem.findUnique({where:{id:orderItemId}});
      if(!locked)throw Error("ITEM_NOT_FOUND");

      // удаляем позицию
      await tx.orderItem.delete({ where: { id: orderItemId } });

      // пересчёт totals
      const remainingItems=await tx.orderItem.findMany({
        where:{orderId:order.id},include:{product:{include:{productGroup:true,brand:true}}}
      });

      const pricing = await updatePreinvoiceOrder(tx,order,remainingItems);
      const subtotal = pricing.subtotalGrossCents / 100;
      const totalAmount = pricing.totalGrossCents / 100;


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
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) return NextResponse.json({ ok: false, message: "Forbidden" }, { status: 403 });
  if (req.headers.get("origin")!==new URL(req.url).origin)return NextResponse.json({ok:false,message:"ORIGIN"},{status:403});
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
      const order=await lockEditableOrder(tx,orderId);

      // 2) продукт (и вариация, если есть)
      const product = await tx.product.findUnique({
        where: { id: productId },
        include: { productGroup: true, brand: true },
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
          items: { include: { product: { include: { productGroup: true, brand: true } } } },
        },
      });
      if (!updated) throw new Error("ORDER_NOT_FOUND");

      const pricing = await updatePreinvoiceOrder(tx,order,updated.items);
      const subtotal = pricing.subtotalGrossCents / 100;
      const totalAmount = pricing.totalGrossCents / 100;

      return {orderId:updated.id,subtotal,totalAmount,itemsCount:updated.items.length}
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Unknown error" },
      { status: 400 }
    );
  }
}
