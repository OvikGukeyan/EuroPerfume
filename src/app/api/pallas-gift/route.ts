import {prisma} from "@/prisma/prisma-client";
import {NextResponse} from "next/server";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {pallasGiftState} from "@/src/shared/server-lib/pallas-gift";
export const dynamic="force-dynamic";
export async function GET(){
 try {
  const session=await getUserSession();
  const account=session?await prisma.user.findUnique({where:{id:Number(session.id)},select:{email:true,verified:true}}):null;
  const state=await pallasGiftState(account?.verified?account.email:null);
  return NextResponse.json({state},{headers:{"Cache-Control":"private, no-store"}});
 }catch{return NextResponse.json({state:"off"},{status:503,headers:{"Cache-Control":"private, no-store"}});}
}
