import {NextResponse} from "next/server";
import {z} from "zod";
import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {UserRole} from "@prisma/client";
import {normalizeCode} from "@/src/shared/server-lib/coupon-policies";

const schema=z.discriminatedUnion("action",[
 z.object({action:z.literal("create"),code:z.string().min(3).max(48).regex(/^[A-Za-z0-9_-]+$/),
  percent:z.number().int().min(1).max(40),kind:z.enum(["WELCOME","PER_ACCOUNT","UNLIMITED"]),
  perUserLimit:z.number().int().min(1).max(100).default(1),
  globalLimit:z.number().int().positive().nullable().default(null),
  endsAt:z.string().datetime().nullable().default(null)}),
 z.object({action:z.literal("restart"),code:z.string().min(3),endsAt:z.string().datetime().nullable()}),
 z.object({action:z.literal("toggle"),code:z.string().min(3),active:z.boolean()})
]);
export async function POST(request:Request){
 const admin=await getUserSession();
 if(!admin||admin.role!==UserRole.ADMIN)return NextResponse.json({error:"FORBIDDEN"},{status:403});
 if(request.headers.get("origin")!==new URL(request.url).origin)return NextResponse.json({error:"ORIGIN"},{status:403});
 let input:z.infer<typeof schema>;
 try{input=schema.parse(await request.json());}catch{return NextResponse.json({error:"INPUT"},{status:400});}
 const code=normalizeCode(input.code);
 try{
  await prisma.$transaction(async tx=>{
   if(input.action==="create"){
    if(await tx.promoCode.findFirst({where:{code:{equals:code,mode:"insensitive"}}}))throw new Error("ALREADY_EXISTS");
    await tx.promoCode.create({data:{code,discount:input.percent,disposable:false,isActive:true,expiresAt:input.endsAt?new Date(input.endsAt):null}});
    await tx.couponPolicy.create({data:{code,kind:input.kind,
     perUserLimit:input.kind==="UNLIMITED"?Math.max(1,input.perUserLimit):input.perUserLimit,
     globalLimit:input.globalLimit,
     validDaysAfterVerification:input.kind==="WELCOME"?60:null,
     endsAt:input.endsAt?new Date(input.endsAt):null}});
   }else if(input.action==="restart"){
    const existing=await tx.promoCode.findFirst({where:{code:{equals:code,mode:"insensitive"}}});
    if(!existing)throw new Error("NOT_FOUND");
    await tx.promoCode.update({where:{id:existing.id},data:{isActive:true,disposable:false,expiresAt:input.endsAt?new Date(input.endsAt):null}});
    const existingPolicy=await tx.couponPolicy.findUnique({where:{code:existing.code}});
    if(existingPolicy)await tx.couponPolicy.update({where:{code:existing.code},data:{epoch:{increment:1},usedCount:0,active:true,endsAt:input.endsAt?new Date(input.endsAt):null}});
    else await tx.couponPolicy.create({data:{code:existing.code,kind:"PER_ACCOUNT",perUserLimit:1,endsAt:input.endsAt?new Date(input.endsAt):null}});
   }else{
    const existing=await tx.promoCode.findFirst({where:{code:{equals:code,mode:"insensitive"}}});
    if(!existing)throw new Error("NOT_FOUND");
    await tx.promoCode.update({where:{id:existing.id},data:{isActive:input.active}});
    await tx.couponPolicy.updateMany({where:{code:existing.code},data:{active:input.active}});
   }
  });
  return NextResponse.json({ok:true});
 }catch(error){
  const e=error as {code?:string;message?:string};
  return NextResponse.json({error:(e.code==="P2002"||e.message==="ALREADY_EXISTS")?"ALREADY_EXISTS":e.code==="P2021"?"MIGRATION_REQUIRED":e.message==="NOT_FOUND"?"NOT_FOUND":"FAILED"},{status:(e.code==="P2002"||e.message==="ALREADY_EXISTS")?409:e.code==="P2021"?503:400});
 }
}
