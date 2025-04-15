import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { UserRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const notes = await prisma.note.findMany();
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const user = await getUserSession();
  if (!user || user.role !== UserRole.ADMIN) {
    throw new Error("Access denied");
  }
  const { data } = await req.json();
  console.log(data);

  const note = await prisma.note.create({
    data,
  });
  return NextResponse.json(note);
}
