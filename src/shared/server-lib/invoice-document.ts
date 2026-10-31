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
