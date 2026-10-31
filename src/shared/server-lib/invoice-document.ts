import 'server-only';
import { createHash } from 'crypto';
import prisma from '@/prisma/prisma-client';

export const pdfHash = (pdf: Uint8Array) => createHash('sha256').update(pdf).digest('hex');
export async function readInvoiceDocument(invoiceId: number) {
 const rows = await prisma.$queryRaw<{pdf: Uint8Array; sha256: string}[]>`SELECT pdf, sha256 FROM "InvoiceDocument" WHERE "invoiceId"=${invoiceId}`;
 if (!rows.length) return null;
 if (pdfHash(rows[0].pdf) !== rows[0].sha256) throw new Error('Invoice integrity check failed');
 return rows[0];
}
// Copies existing bytes, never regenerates an issued invoice. Removed after migration.
export async function archiveLegacyInvoice(invoiceId: number) {
 const existing = await readInvoiceDocument(invoiceId);
 if (existing) return existing;
 const invoice = await prisma.invoice.findUniqueOrThrow({where:{id:invoiceId}});
 const url = new URL(invoice.pdfUrl!);
 if (url.origin !== 'https://thgjecpmxhqwfoknvjiu.supabase.co' || !url.pathname.startsWith('/storage/v1/object/public/invoice/')) throw new Error('Unexpected legacy source');
 const response = await fetch(url, {cache:'no-store',redirect:'error',signal:AbortSignal.timeout(20000)});
 if (!response.ok) throw new Error('Legacy source unavailable');
 const pdf = Buffer.from(await response.arrayBuffer());
 if (pdf.length > 2000000 || pdf.subarray(0,5).toString() !== '%PDF-') throw new Error('Invalid PDF source');
 const sha256 = pdfHash(pdf);
 await prisma.$executeRaw`INSERT INTO "InvoiceDocument" ("invoiceId",pdf,sha256,"sourceUrl") VALUES (${invoiceId},${pdf},${sha256},${invoice.pdfUrl}) ON CONFLICT ("invoiceId") DO NOTHING`;
 const stored = await readInvoiceDocument(invoiceId);
 if (!stored || stored.sha256 !== sha256) throw new Error('Legacy archive mismatch');
 return stored;
}
