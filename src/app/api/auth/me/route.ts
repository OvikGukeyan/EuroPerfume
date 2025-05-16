import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getUserSession } from "@/src/shared/lib/get-user-session";

export async function GET(req: NextRequest) {
    try {
        const user = await getUserSession();

        if(!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 401 });
        }

        const data = await prisma.user.findFirst({
            where: {
                id: Number(user.id)
            },
            select: {
                email: true,
                fullName: true,
                password: false,
                role: true
            }

        });

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error [USER GET]' }, { status: 500 });
    }
}