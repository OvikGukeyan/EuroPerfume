import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/src/shared/lib/get-user-session";

import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Access denied");
  }
  const { data } = await req.json();

  const purpose = await prisma.purpose.create({
    data,
  });
  return NextResponse.json(purpose);
}
