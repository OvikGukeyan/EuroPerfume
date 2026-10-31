import prisma from '@/prisma/prisma-client';
import { getUserSession } from '@/src/shared/server-lib/get-user-session';
import { archiveLegacyInvoice } from '@/src/shared/server-lib/invoice-document';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{orderId:string}>}) {
 const session=await getUserSession();
 if (!session) return new Response('Forbidden',{status:403});
 const user=await prisma.user.findUnique({where:{id:Number(session.id)},select:{id:true,role:true}});
 if(!user) return new Response('Forbidden',{status:403});
 const {orderId}=await params;
 if(!/^[1-9]\d*$/.test(orderId) || !Number.isSafeInteger(Number(orderId))) return new Response('Not found',{status:404});
 const invoice=await prisma.invoice.findUnique({where:{orderId:Number(orderId)},include:{order:{select:{userId:true}}}});
 if(!invoice || (user.role!=='ADMIN' && invoice.order.userId!==user.id)) return new Response('Not found',{status:404});
 const file=await archiveLegacyInvoice(invoice.id);
 return new Response(new Uint8Array(file.pdf),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${invoice.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g,'_')}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
}
