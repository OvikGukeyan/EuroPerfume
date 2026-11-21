import {prisma} from "@/prisma/prisma-client";
import {getUserSession} from "@/src/shared/server-lib/get-user-session";
import {UserRole} from "@prisma/client";
export const dynamic="force-dynamic";
const csv=(value:string)=>'"'+( /^[=+\-@]/.test(value)? "'"+value:value ).replace(/"/g,'""')+'"';
export async function GET(){
 const session=await getUserSession();
 if(!session)return Response.json({error:"UNAUTHORIZED"},{status:401});
 const actor=await prisma.user.findUnique({where:{id:Number(session.id)},select:{role:true}});
 if(actor?.role!==UserRole.ADMIN)return Response.json({error:"FORBIDDEN"},{status:403});
 // Always recheck consent at export time. Never include unverified, withdrawn or guest addresses.
 const users=await prisma.user.findMany({where:{
  verified:{not:null},accountConsent:{is:{marketingConfirmedAt:{not:null},marketingWithdrawnAt:null}}
 },select:{email:true},orderBy:{id:"asc"}});
 const unique=[...new Set(users.map(u=>u.email.trim().toLowerCase()))];
 const content="email\r\n"+unique.map(csv).join("\r\n")+(unique.length?"\r\n":"");
 return new Response("\ufeff"+content,{headers:{
  "Content-Type":"text/csv; charset=utf-8",
  "Content-Disposition":'attachment; filename="europerfume-consented-emails.csv"',
  "Cache-Control":"private, no-store, max-age=0",
  "X-Content-Type-Options":"nosniff"
 }});
}
