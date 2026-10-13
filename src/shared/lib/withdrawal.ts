import { z } from "zod";
import { business, businessAddress } from "@/src/shared/constants/business";

export const withdrawalSchema = z.object({
  requestId: z.string().uuid(),
  fullName: z.string().trim().min(1).max(150),
  email: z.string().trim().email().max(254),
  contractIdentifier: z.string().trim().min(1).max(1000),
  locale: z.enum(["de", "ru"]),
  website: z.string().max(0).optional(),
}).strict();

export type WithdrawalInput = z.infer<typeof withdrawalSchema>;
export type WithdrawalReceipt = {
  reference: string;
  receivedAt: string;
  text: string;
};
export type ConfirmationEmail = {
  from: string;
  to: string;
  bcc?: string;
  replyTo: string;
  subject: string;
  text: string;
};

export function makeWithdrawalReceipt(input: WithdrawalInput, now: Date, reference: string): WithdrawalReceipt {
  const receivedAt = now.toISOString();
  const date = new Intl.DateTimeFormat("de-DE", {
    dateStyle: "long", timeStyle: "long", timeZone: "Europe/Berlin",
  }).format(now);
  const text = [
    "Eingangsbestätigung Ihrer Widerrufserklärung",
    "", businessAddress, `E-Mail: ${business.email}`, "",
    `Referenz: ${reference}`,
    `Eingegangen am: ${date} (Europe/Berlin)`,
    `Zeitstempel (UTC): ${receivedAt}`, "",
    `Name des Verbrauchers: ${input.fullName}`,
    `E-Mail für die Eingangsbestätigung: ${input.email}`,
    "Vertrag / Bestellung / betroffene Waren:", input.contractIdentifier, "",
    "Widerrufserklärung:",
    "Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf der oben bezeichneten Waren beziehungsweise den angegebenen Teil des Vertrags.",
    "", "Wir bestätigen den Eingang Ihrer oben wiedergegebenen Widerrufserklärung.",
    "Bitte senden Sie die betreffenden Waren entsprechend unserer Widerrufsbelehrung an die oben genannte Adresse zurück. Ihre gesetzlichen Rechte bleiben unberührt.",
    "Bitte bewahren Sie diese Eingangsbestätigung auf.",
    ...(input.locale === "ru" ? ["", "Подтверждение получения заявления об отказе от договора.",
      "Содержание заявления и дата его получения указаны выше. Сохраните это письмо."] : []),
  ].join("\n");
  return { reference, receivedAt, text };
}

export type StoredWithdrawal = {
  id: string;
  fullName: string;
  email: string;
  contractIdentifier: string;
  locale: string;
  receivedAt: Date;
  confirmationSentAt: Date | null;
  receiptText: string;
};
export type WithdrawalStore = {
  persist: (input: WithdrawalInput, receipt: WithdrawalReceipt) => Promise<StoredWithdrawal>;
  markSent: (id: string, emailId: string, date: Date) => Promise<void>;
};

// Save before sending email. A mail outage must not discard a declaration or
// change its original receipt time. Reusing a request ID never creates a new row.
export function createWithdrawalHandler({ store, send, now = () => new Date() }: {
  store: WithdrawalStore;
  send: (email: ConfirmationEmail, key: string) => Promise<string>;
  now?: () => Date;
}) {
  const limits = new Map<string, { count: number; until: number }>();
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "INVALID_ORIGIN" }, { status: 403 });
    if (!request.headers.get("content-type")?.startsWith("application/json")) return Response.json({ error: "INVALID_CONTENT_TYPE" }, { status: 415 });
    const body = await request.text();
    if (new TextEncoder().encode(body).length > 8192) return Response.json({ error: "REQUEST_TOO_LARGE" }, { status: 413 });
    let data: unknown;
    try { data = JSON.parse(body); } catch { return Response.json({ error: "INVALID_INPUT" }, { status: 400 }); }
    const parsed = withdrawalSchema.safeParse(data);
    if (!parsed.success) return Response.json({ error: "INVALID_INPUT" }, { status: 400 });
    const input = parsed.data;
    const date = now(), time = date.getTime();
    for (const [key, value] of limits) if (value.until <= time) limits.delete(key);
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const keys = [`email:${input.email.toLowerCase()}`, ...(ip ? [`ip:${ip}`] : [])];
    if (keys.some(key => (limits.get(key)?.count ?? 0) >= 10)) return Response.json({ error: "TOO_MANY_REQUESTS" }, { status: 429, headers: { "Retry-After": "600" } });
    if (limits.size > 5000) limits.clear();
    for (const key of keys) {
      const prior = limits.get(key);
      limits.set(key, { count: (prior?.count ?? 0) + 1, until: prior?.until ?? time + 600000 });
    }
    let record: StoredWithdrawal;
    try { record = await store.persist(input, makeWithdrawalReceipt(input, date, input.requestId)); } catch {
      for (const key of keys) { const value = limits.get(key); if (value) value.count--; }
      return Response.json({ error: "REGISTRATION_UNAVAILABLE" }, { status: 503 });
    }
    if (record.fullName !== input.fullName || record.email !== input.email || record.contractIdentifier !== input.contractIdentifier || record.locale !== input.locale) return Response.json({ error: "REQUEST_CONFLICT" }, { status: 409 });
    const receipt: WithdrawalReceipt = { reference: record.id, receivedAt: record.receivedAt.toISOString(), text: record.receiptText };
    let emailSent = Boolean(record.confirmationSentAt);
    if (!emailSent) {
      try {
        const emailId = await send({
          from: "Euro Perfume <info@euro-perfume.com>", to: input.email,
          bcc: input.email.toLowerCase() === business.email.toLowerCase() ? undefined : business.email,
          replyTo: business.email,
          subject: `${business.name}: Eingangsbestätigung Ihres Widerrufs`, text: receipt.text,
        }, `withdrawal-${record.id}`);
        emailSent = true;
        try { await store.markSent(record.id, emailId, now()); } catch { /* Provider idempotency protects an identical retry. */ }
      } catch { /* The persisted declaration remains valid and downloadable. */ }
    }
    return Response.json({ receipt, emailSent }, { headers: { "Cache-Control": "no-store" } });
  };
}
