import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const existingPopularProducts = await prisma.popularProducts.findFirst({
    where: { date: startOfDay },
    include: {
      products: true,
    },
  });

  if (existingPopularProducts) {
    return NextResponse.json(existingPopularProducts.products);
  }

  const popularProducts = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 10,
  });

  const popularProductIds = popularProducts.map((p) => p.productId);

  const availableProducts = await prisma.product.findMany({
    where: {
      id: { in: popularProductIds },
      available: true,
    },
    select: { id: true },
  });

  const data = await prisma.popularProducts.create({
    data: {
      date: startOfDay,
      products: { connect: availableProducts },
    },
  });

  return NextResponse.json(data);
}
