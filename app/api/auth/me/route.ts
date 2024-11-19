import { prisma } from "@/prisma/prisma-client";
import { getUserSession } from "@/shared/lib/get-user-session";
import { NextRequest, NextResponse } from "next/server";

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
                password: false
            }

        });

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error [USER GET]' }, { status: 500 });
    }
}