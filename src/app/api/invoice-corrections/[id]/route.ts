import { prisma } from '@/prisma/prisma-client';
import { requireInvoiceAdmin } from '@/src/shared/server-lib/invoice-corrections';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try { await requireInvoiceAdmin(); } catch { return new Response('Forbidden', { status: 403 }); }
  const { id } = await params;
  if (!/^[a-f0-9-]{36}$/i.test(id)) return new Response('Not found', { status: 404 });
  const rows = await prisma.$queryRaw<{ pdf: Uint8Array; number: string }[]>`SELECT pdf, number FROM "InvoiceCorrection" WHERE id = ${id}`;
  if (!rows.length) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(rows[0].pdf), { headers: {
    'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${rows[0].number}.pdf"`,
    'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff',
  } });
}
