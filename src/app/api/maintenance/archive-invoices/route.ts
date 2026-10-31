import { createHash } from 'crypto';
import prisma from '@/prisma/prisma-client';
import { archiveLegacyInvoice } from '@/src/shared/server-lib/invoice-document';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export const maxDuration=60;
// Temporary scoped migration capability. No customer data is returned.
export async function POST(request:Request) {
 const token=request.headers.get('authorization')?.replace(/^Bearer /,'') ?? '';
 if(Date.now()>Date.parse('2026-11-01T23:59:59Z') || createHash('sha256').update(token).digest('hex')!=='f8a3dbc17cb6fee65ebc2eccc04111e12b483bca27a55749bf0a356c4ed3d76e') return new Response('Forbidden',{status:403});
 const rows=await prisma.$queryRaw<{id:number}[]>`SELECT i.id FROM "Invoice" i LEFT JOIN "InvoiceDocument" d ON d."invoiceId"=i.id WHERE d."invoiceId" IS NULL ORDER BY i.id LIMIT 12`;
 await Promise.all(rows.map(r=>archiveLegacyInvoice(r.id)));
 return Response.json({processed:rows.length},{headers:{'Cache-Control':'no-store'}});
}
