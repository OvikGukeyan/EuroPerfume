import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  for (const { id, order } of body) {
    await prisma.slide.update({
      where: { id },
      data: { order },
    });
  }

  return NextResponse.json({ success: true });
}