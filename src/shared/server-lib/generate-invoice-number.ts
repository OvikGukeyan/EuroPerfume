import { prisma } from "@/prisma/prisma-client";

export async function generateInvoiceNumber() {
  const year = new Date().getFullYear();

  const counter = await prisma.$transaction(async (tx) => {
    const existing = await tx.invoiceCounter.findUnique({
      where: { year },
    });

    if (existing) {
      return tx.invoiceCounter.update({
        where: { year },
        data: { lastValue: { increment: 1 } },
      });
    }

    return tx.invoiceCounter.create({
      data: { year, lastValue: 1 },
    });
  });

  const number = counter.lastValue.toString().padStart(6, "0");

  return `EP-${year}-${number}`;
}