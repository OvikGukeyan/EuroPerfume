import { Brand, Order, OrderItem, Product, ProductGroup } from "@prisma/client";
import { PricingSnapshot, invoiceTax, berlinDate } from "../lib/tax";
import { business } from "../constants/business";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin" }).format(new Date(d));
}
export async function generateInvoicePdf(
  order: Order & {
    items: (OrderItem & {
      product: Product & { brand: Brand; productGroup: ProductGroup };
    })[];
  },
  invoiceNumber: string,
  pricing: PricingSnapshot,
  tax: ReturnType<typeof invoiceTax>,
  issuedAt = new Date()
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    autoFirstPage: true,
  });

  doc.registerFont("EuroRegular", path.join(process.cwd(), "public/fonts/DejaVuSans.ttf"));
  doc.registerFont("EuroBold", path.join(process.cwd(), "public/fonts/DejaVuSans-Bold.ttf"));
  doc.font("EuroRegular");

  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });

  const logoPath = path.join(process.cwd(), "public/assets", "logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 120, align: "center" });
  }
  doc.moveDown(2);

  // Левая колонка — продавец (подставь свои данные)
  doc.fontSize(10).text(
    `Euro Perfume
Vitalii Saiian
Schillerstrasse 40
49811 Lingen
Deutschland`,
    50,
    120
  );

  // Правая — адрес доставки (подставь поля из order)
  doc.fontSize(10).text(
    `Rechnungsadresse:
${order.fullName}
${order.address} ${order.houseNumber}
${order.zip} ${order.city}
${order.country}`,
    350,
    120
  );

  // Rechnung + даты
  doc.fontSize(16).text("Rechnung", 50, 220);
  doc.fontSize(10).text(
    `Rechnungsnummer: ${invoiceNumber}
Bestellnummer: ${order.id}
Bestelldatum: ${fmtDate(order.createdAt)}
Rechnungsdatum: ${berlinDate(issuedAt)}
Leistungsdatum: ${tax.supplyDate}`,
    50,
    245
  );

  // Prices come from the saved order, not today's catalog.
  let y = 325;
  function tableHeader() {
    doc.fontSize(10).text("Pos", 50, y);
    doc.text("Artikel", 90, y);
    doc.text("Stk./Ml.", 370, y, { width: 70, align: "right" });
    doc.text(tax.mode === "vat" ? "Bruttopreis" : "Gesamtpreis", 465, y, { width: 80, align: "right" });
    y += 16;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;
  }
  tableHeader();
  for (const [index, line] of pricing.lines.entries()) {
    const height = Math.max(22, doc.heightOfString(line.title, { width: 260 }) + 8);
    if (y + height > 590) { doc.addPage(); y = 80; tableHeader(); }
    doc.text(String(index + 1), 50, y);
    doc.text(line.title, 90, y, { width: 260 });
    doc.text(String(line.quantity) + (line.onTap ? " ml" : " Stk."), 370, y, { width: 70, align: "right" });
    doc.text((line.grossCents / 100).toFixed(2) + " €", 465, y, { width: 80, align: "right" });
    y += height;
  }
  if (y > 540) { doc.addPage(); y = 80; }
  y += 10;
  doc.moveTo(320, y).lineTo(550, y).stroke();
  y += 10;
  function amount(label: string, value: number) {
    doc.fontSize(10).text(label, 320, y, { width: 150 });
    doc.text((value / 100).toFixed(2) + " €", 470, y, { width: 75, align: "right" });
    y += 18;
  }
  amount("Warenwert:", pricing.subtotalGrossCents);
  amount("Porto und Verpackung:", pricing.shippingGrossCents);
  if (pricing.discountGrossCents > 0) {
    doc.text("Gutschein:", 320, y, { width: 150 });
    doc.text("−" + (pricing.discountGrossCents / 100).toFixed(2) + " €", 470, y, { width: 75, align: "right" });
    y += 18;
  }
  if (tax.mode === "vat") {
    amount("Nettobetrag:", tax.netCents);
    amount("Umsatzsteuer " + String((tax.rateBasisPoints ?? 0) / 100) + "%:", tax.vatCents);
  } else {
    doc.fontSize(9).text("Steuerbefreit gemäß §19 Abs. 1 UStG. Umsatzsteuer wird nicht ausgewiesen.", 320, y, { width: 225 });
    y += 32;
  }
  doc.font("EuroBold");
  amount(tax.mode === "vat" ? "Gesamtbetrag (brutto):" : "Gesamtbetrag:", tax.grossCents);
  doc.font("EuroRegular");

  // ====== FOOTER ======
  doc.fontSize(8).text(
    `EuroPerfume
Vitalii Saiian
Schillerstrasse 40 | 49811 Lingen | Deutschland
E-Mail: europerfumeshop@gmail.com
USt-IdNr.: ${business.vatId}

Bank: Qonto (Qonto Europe S.A.) 
IBAN: DE96 1001 0123 2124 7366 74
BIC: QNTODEB2XXX`,
    50,
    700,
    { width: 495, align: "left" }
  );

  doc.end();
  return done;
}
