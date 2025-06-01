import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid finish ID" },
        { status: 400 }
      );
    }
    await prisma.finish.delete({
      where: { id },
    });

    const  updatedFinish = await prisma.finish.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(updatedFinish);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
