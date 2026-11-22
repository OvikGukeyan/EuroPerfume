import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {OrderStatus,UserRole} from "@prisma/client";
import {z} from "zod";

export const dynamic="force-dynamic";
export const runtime="nodejs";
const noStore={"Cache-Control":"private, no-store"} as const;
async function authenticatedAdmin(){
 const session=await getUserSession();
 if(!session)return null;
 const id=Number(session.id);
 if(!Number.isSafeInteger(id)||id<1)return null;
 const user=await prisma.user.findUnique({where:{id},select:{role:true}});
 return user?.role===UserRole.ADMIN?id:null;
}
export async function GET(){
 const adminId=await authenticatedAdmin();
 if(!adminId)return Response.json({error:"FORBIDDEN"},{status:403,headers:noStore});
 try{
  // New orders are ACTION ITEMS, not read-on-open messages:
  // their badge persists until the order is moved out of NEW (e.g. PENDING).
  // Count all NEW orders, including ones placed before notifications were installed.
  const [unread,groups,newOrders,newOrderCount]=await Promise.all([
   prisma.adminNotification.findMany({where:{kind:{not:"new_order"},seen:{none:{adminId}}},orderBy:[{createdAt:"desc"},{id:"desc"}],take:100,
    select:{id:true,kind:true,category:true,createdAt:true,userId:true,orderId:true}}),
   prisma.adminNotification.groupBy({by:["category"],where:{kind:{not:"new_order"},seen:{none:{adminId}}},_count:{_all:true}}),
   prisma.order.findMany({where:{status:OrderStatus.NEW},orderBy:[{createdAt:"desc"},{id:"desc"}],take:100,
    select:{id:true,userId:true,email:true,createdAt:true}}),
   prisma.order.count({where:{status:OrderStatus.NEW}})
  ]);
  const userIds=[...new Set(unread.map(item=>item.userId).filter((id):id is number=>id!==null))];
  const users=userIds.length?await prisma.user.findMany({where:{id:{in:userIds}},
    select:{id:true,email:true}}):[];
  const byId=new Map(users.map(u=>[u.id,u.email]));
  const counts={crm:0,club:0,orders:0,campaigns:0};
  for(const group of groups){
   if(group.category in counts)counts[group.category as keyof typeof counts]=group._count._all;
  }
  counts.orders+=newOrderCount;
  const messages=[
   ...unread.map(row=>({id:row.id.toString(),kind:row.kind,category:row.category,
    email:row.userId?byId.get(row.userId)||null:null,
    orderId:row.orderId,userId:row.userId,createdAt:row.createdAt.toISOString()})),
   ...newOrders.map(order=>({id:`new-order:${order.id}`,kind:"new_order",category:"orders",
    email:order.email,orderId:order.id,userId:order.userId,createdAt:order.createdAt.toISOString()}))
  ].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,100);
  return Response.json({
   total:Object.values(counts).reduce((a,b)=>a+b,0),counts,
   unread:messages
  },{headers:noStore});
 }catch(e){
  console.error("[ADMIN_NOTIFICATIONS_GET]",e);
  return Response.json({error:"UNAVAILABLE"},{status:503,headers:noStore});
 }
}
const idsSchema=z.object({ids:z.array(z.string().regex(/^\d{1,19}$/)).min(1).max(100)});
export async function POST(request:Request){
 const adminId=await authenticatedAdmin();
 if(!adminId)return Response.json({error:"FORBIDDEN"},{status:403,headers:noStore});
 if(request.headers.get("origin")!==new URL(request.url).origin)return Response.json({error:"ORIGIN"},{status:403,headers:noStore});
 let ids:string[];
 try{ids=idsSchema.parse(await request.json()).ids;}catch{return Response.json({error:"INPUT"},{status:400,headers:noStore});}
 try{
  const unique=[...new Set(ids)].map(BigInt);
  const existing=await prisma.adminNotification.findMany({where:{id:{in:unique}},select:{id:true}});
  if(existing.length)await prisma.adminNotificationSeen.createMany({
   data:existing.map(item=>({adminId,notificationId:item.id})),skipDuplicates:true
  });
  return Response.json({ok:true,seen:existing.length},{headers:noStore});
 }catch(e){
  console.error("[ADMIN_NOTIFICATIONS_SEEN]",e);
  return Response.json({error:"UNAVAILABLE"},{status:503,headers:noStore});
 }
}
