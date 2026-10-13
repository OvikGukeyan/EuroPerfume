import { prisma } from "@/prisma/prisma-client";
import { createWithdrawalHandler } from "@/src/shared/lib/withdrawal";

export const runtime = "nodejs";

export const POST = createWithdrawalHandler({
  store: {
    async persist(input, receipt) {
      return prisma.withdrawalRequest.upsert({
        where: { id: input.requestId },
        create: { id: input.requestId, fullName: input.fullName, email: input.email, contractIdentifier: input.contractIdentifier, locale: input.locale, receivedAt: new Date(receipt.receivedAt), receiptText: receipt.text },
        update: {},
      });
    },
    async markSent(id, emailId, date) {
      await prisma.withdrawalRequest.update({ where: { id }, data: { confirmationEmailId: emailId, confirmationSentAt: date } });
    },
  },
  async send(email, key) {
    if (!process.env.RESEND_API_KEY) throw new Error("Email service unavailable");
    const { replyTo, to, bcc, ...body } = email;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": key },
      body: JSON.stringify({ ...body, to: [to], ...(bcc ? { bcc: [bcc] } : {}), reply_to: replyTo }),
      signal: AbortSignal.timeout(10000),
    });
    const data = await response.json();
    if (!response.ok || !data?.id) throw new Error("Confirmation was not accepted");
    return data.id;
  },
});
