import {prisma} from '@/prisma/prisma-client';
import {getUserSession} from '@/src/shared/server-lib/get-user-session';
import {compare,hash} from 'bcrypt';
import {z} from 'zod';
import {sendNewsletterConfirmation} from '@/src/shared/server-lib/registration-consent';
import {euCountriesAlpha3} from '@/src/shared/lib/calc-total-amount-with-delivery';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const addressSchema=z.object({fullName:z.string().trim().min(2).max(120),street:z.string().trim().min(2).max(150),houseNumber:z.string().trim().min(1).max(20),city:z.string().trim().min(2).max(100),postalCode:z.string().trim().min(2).max(15),country:z.string().refine(c=>euCountriesAlpha3.includes(c)),phone:z.string().trim().max(40).default('')}).strict();
export async function POST(request:Request) {
 // Cookie sessions must never authorize cross-origin mutations.
 if(request.headers.get('origin')!==new URL(request.url).origin) return Response.json({error:'Forbidden'},{status:403});
 const session=await getUserSession();
 if(!session) return Response.json({error:'Unauthorized'},{status:401});
 const userId=Number(session.id);
 let body;try{body=await request.json();}catch{return Response.json({error:'Invalid input'},{status:400});}
 try {
 if(body.action==='unsubscribe') {
 await prisma.accountConsent.updateMany({where:{userId},data:{marketingWithdrawnAt:new Date(),confirmationTokenHash:null,confirmationExpiresAt:null}});
 } else if(body.action==='resendNewsletter') {
 const sent=await sendNewsletterConfirmation(userId);
 if(!sent)return Response.json({error:'NEWSLETTER_WAIT'},{status:429});
 } else if(body.action==='profile') {
 const {fullName}=z.object({fullName:z.string().trim().min(2).max(120)}).parse(body);
 await prisma.user.update({where:{id:userId},data:{fullName}});
 } else if(body.action==='password') {
 const data=z.object({currentPassword:z.string().min(1).max(200),password:z.string().min(10).max(72),confirmPassword:z.string()}).refine(v=>v.password===v.confirmPassword).parse(body);
 const user=await prisma.user.findUnique({where:{id:userId},select:{password:true,provider:true}});
 if(!user||user.provider||!await compare(data.currentPassword,user.password)) return Response.json({error:'CURRENT_PASSWORD'},{status:400});
 await prisma.user.update({where:{id:userId},data:{password:await hash(data.password,12)}});
 } else if(body.action==='address') {
 const data=addressSchema.parse(body.address);
 const count=await prisma.customerAddress.count({where:{userId}});
 if(count>=10) return Response.json({error:'ADDRESS_LIMIT'},{status:400});
 await prisma.customerAddress.create({data:{...data,userId}});
 } else if(body.action==='deleteAddress') {
 const id=z.string().uuid().parse(body.id);
 await prisma.customerAddress.deleteMany({where:{id,userId}});
 } else return Response.json({error:'Invalid action'},{status:400});
 return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
 }catch(error){if(error instanceof z.ZodError)return Response.json({error:'INVALID_INPUT'},{status:400});return Response.json({error:'SAVE_FAILED'},{status:500});}
}

export async function GET() {
 const session=await getUserSession();
 if(!session)return Response.json({error:'Unauthorized'},{status:401});
 const data=await prisma.user.findUnique({where:{id:Number(session.id)},select:{fullName:true,email:true,addresses:{select:{id:true,fullName:true,street:true,houseNumber:true,city:true,postalCode:true,country:true,phone:true},orderBy:{createdAt:'desc'}}}});
 return Response.json(data,{headers:{'Cache-Control':'private, no-store'}});
}
