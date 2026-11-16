import { BLACK_FRIDAY, blackFridayActive, isBlackFridayCode } from "@/src/shared/lib/black-friday";
import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { code } = await req.json();

  // Reserved campaign code never falls through to an unrestricted database code.
  if (isBlackFridayCode(code)) {
    const active = blackFridayActive();
    return NextResponse.json(active
      ? { valid: true, code: BLACK_FRIDAY.code, discount: BLACK_FRIDAY.discount, excludeDiscounted: true, expiresAt: BLACK_FRIDAY.endsAt }
      : { valid: false, message: "BLACK15: 27.11.2026, Europe/Berlin" },
      { status: active ? 200 : 404 });
  }
  const promo = await prisma.promoCode.findFirst({
    where: {
      code,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
  });

  if (!promo) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }


  return NextResponse.json({
    valid: true,
    discount: promo.discount,
  });
}