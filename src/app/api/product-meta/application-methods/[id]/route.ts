import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = Number((await params).id);
    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid aplicationMethod ID" },
        { status: 400 }
      );
    }
    await prisma.applicationMethod.delete({
      where: { id },
    });

    const updatedAromas = await prisma.applicationMethod.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json(updatedAromas);
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
