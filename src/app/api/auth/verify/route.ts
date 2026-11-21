import { prisma } from "@/prisma/prisma-client";
import {sendWelcomeOfferIfConsented} from "@/src/shared/server-lib/welcome-offer-mail";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req: NextRequest) {
    try {
        const code = req.nextUrl.searchParams.get('code');
        if(!code) {
            return NextResponse.json({ message: 'Code not found' }, { status: 400 });
        };
        const verificationCode = await prisma.verificationCode.findFirst({
            where: {
                code
            },
        });

        if(!verificationCode || verificationCode.expiresAt < new Date()) {
            return NextResponse.json({ message: 'Code not found' }, { status: 400 });
        }

        await prisma.user.update({
            where: {
                id: verificationCode.userId
            },
            data: {
                verified: new Date()
            }
        });

        await prisma.verificationCode.delete({
            where: {
                id: verificationCode.id
            }
        })
        // Registration verification is not marketing consent: promotional mail is double-opt-in only.
        await sendWelcomeOfferIfConsented(verificationCode.userId).catch(e=>console.error("[WELCOME_EMAIL]",e));

        return NextResponse.redirect(new URL(`/${req.nextUrl.searchParams.get('locale')==='ru'?'ru':'de'}/?verified`, req.url));
    } catch (error) {
        console.error(error);
        console.log('Server Error [VERIFY_GET]', error);
    }
}