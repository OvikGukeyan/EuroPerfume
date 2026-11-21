import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
export const dynamic="force-dynamic";
export async function GET(){
 const session=await getUserSession();
 if(!session)return Response.json({enabled:false,balancePoints:0},{headers:{"Cache-Control":"private, no-store"}});
 const uid=Number(session.id);
 const user=await prisma.user.findUnique({where:{id:uid},select:{verified:true}});
 if(!user?.verified)return Response.json({enabled:false,balancePoints:0},{headers:{"Cache-Control":"private, no-store"}});
 const wallet=await prisma.loyaltyWallet.findUnique({where:{userId:uid},select:{balancePoints:true}});
 return Response.json({enabled:process.env.EUROPERFUME_CLUB_REDEMPTION_ENABLED==="true",balancePoints:Math.max(0,wallet?.balancePoints||0)},{headers:{"Cache-Control":"private, no-store"}});
}
