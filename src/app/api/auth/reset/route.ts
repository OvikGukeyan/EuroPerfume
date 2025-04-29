import { prisma } from "prisma/prisma-client";
import { hashSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PATCH(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const data = (await req.json()) as { password: string };
    if (!code) {
      return NextResponse.json({ message: "Code not found" }, { status: 400 });
    }
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        code,
      },
    });

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Code not found or expired" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        id: verificationCode.userId,
      },
      data: {
        verified: new Date(),
        password: hashSync(String(data.password), 10),
      },
    });

    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    return NextResponse.redirect(new URL("/?reseted", req.url));
  } catch (error) {
    console.error(error);
    console.log("Server Error [VERIFY_GET]", error);
  }
}
