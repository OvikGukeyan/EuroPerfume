import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  const promo = await prisma.promoCode.findFirst({
    where: {
      code,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (!promo) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  if(promo.disposable) {
    await prisma.promoCode.delete({
      where: {
        id: promo.id
      }
    })
  }

  return NextResponse.json({
    valid: true,
    discount: promo.discount,
  });
}