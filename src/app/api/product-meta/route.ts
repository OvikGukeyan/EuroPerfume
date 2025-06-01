import { prisma } from "@/prisma/prisma-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [
      aromas,
      notes,
      classifications,
      effects,
      finishes,
      purposes,
      skinTypes,
      packagingFormats,
      applicationMethods,
      textures,
      formulas,
      brands,
    ] = await prisma.$transaction([
      prisma.aroma.findMany(),
      prisma.note.findMany(),
      prisma.classification.findMany(),
      prisma.effect.findMany(),
      prisma.finish.findMany(),
      prisma.purpose.findMany(),
      prisma.skinType.findMany(),
      prisma.packagingFormat.findMany(),
      prisma.applicationMethod.findMany(),
      prisma.texture.findMany(),
      prisma.formula.findMany(),
      prisma.brand.findMany(),
    ]);

    return NextResponse.json({
      aromas,
      notes,
      classifications,
      effects,
      finishes,
      purposes,
      skinTypes,
      packagingFormats,
      applicationMethods,
      textures,
      formulas,
      brands,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
