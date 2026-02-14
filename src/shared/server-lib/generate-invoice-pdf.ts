import { Brand, Order, OrderItem, Product, ProductGroup } from "@prisma/client";
import { calcPrice, calcTotlalAmountWithDelivery } from "../lib";
import { Volume } from "../constants/perfume";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("de-DE").format(new Date(d));
}
export async function generateInvoicePdf(
  order: Order & {
    items: (OrderItem & {
      product: Product & { brand: Brand; productGroup: ProductGroup };
    })[];
  },
  invoiceNumber: string
): Promise<Buffer> {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    autoFirstPage: true,
  });

  const chunks: Buffer[] = [];
  doc.on("data", (c) => chunks.push(c));
  const done = new Promise<Buffer>((resolve) =>
    doc.on("end", () => resolve(Buffer.concat(chunks)))
  );

  const logoPath = path.join(process.cwd(), "public/assets", "logo.png");

  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 40, { width: 120, align: "center" });
  }
  doc.moveDown(2);

  // Левая колонка — продавец (подставь свои данные)
  doc.fontSize(10).text(
    `Euro Perfume
Saiian Vitalii
Kollwitzstraße 8
49808 Lingen
Deutschland`,
    50,
    120
  );

  // Правая — адрес доставки (подставь поля из order)
  doc.fontSize(10).text(
    `Lieferadresse:
${order.deliveryFullNmae ?? order.fullName ?? "-"}
${order.deliveryAddress ?? "-"} ${order.deliveryHouseNumber ?? "-"}
${order.deliveryZip ?? ""} ${order.deliveryCity ?? ""}
${order.deliveryCountry ?? ""}`,
    350,
    120
  );

  // Rechnung + даты
  doc.fontSize(16).text("Rechnung", 50, 220);
  doc.fontSize(10).text(
    `Rechnungsnummer: ${invoiceNumber}
Bestellnummer: ${order.id}
Bestelldatum: ${fmtDate(order.createdAt)}`,
    50,
    245
  );

  // ====== TABLE ======
  let y = 300;

  doc.fontSize(10).text("Pos", 50, y);
  doc.text("Artikel", 90, y);
  // doc.text("MwSt.", 360, y);
  doc.text("Stk./Ml.", 370, y, { width: 70, align: "right" });
  doc.text("Gesamtpreis", 475, y, { width: 70, align: "right" });

  y += 15;
  doc.moveTo(50, y).lineTo(550, y).stroke();
  y += 10;

  let subtotal = 0;

  for (const [index, item] of order.items.entries()) {
    const qty = item.quantity;
    const price =
      Number(item.product.discountPrice) || Number(item.product.price);

    let line = qty * price;
    if (item.product.productGroup?.onTap) {
      line = calcPrice(qty as Volume, price);
    }
    subtotal += line;

    const title = `${item.product.brand.name} | ${item.product.name}`;

    doc.text(String(index + 1), 50, y);
    doc.text(title, 90, y, { width: 260 });
    // doc.text("19%", 360, y);
    doc.text(
      `${qty} ${item.product.productGroup?.onTap ? "ml" : "Stk."}`,
      370,
      y,
      { width: 70, align: "right" }
    );
    doc.text(`${line.toFixed(2)} €`, 475, y, { width: 70, align: "right" });

    y += 22;

    // если очень много товаров — можно добавить перенос страницы
    if (y > 680) {
      doc.addPage();
      y = 80;
    }
  }

  const { totalAmountWithDelivery, deliveryPrice } =
    calcTotlalAmountWithDelivery(subtotal, order.deliveryCountry);

  // ====== TOTALS ======
  y += 10;
  doc.moveTo(350, y).lineTo(550, y).stroke();
  y += 10;

  // Если у тебя цены уже “brutto” — VAT нужно считать иначе.
  // Здесь пример: subtotal = brutto без доставки/скидки.
  // const shipping = Number(order.deliveryPrice ?? 0);
  // const discount = Number(order.discountAmount ?? 0); // если есть такое поле
  // const shipping = 77;

  doc.text("Gemäß §19 UStG wird keine Umsatzsteuer berechnet.", 350, y);
  y += 28;
  doc.fontSize(10).text("Zwischensumme:", 350, y);
  doc.text(`${subtotal.toFixed(2)} €`, 500, y, { align: "right" });
  y += 14;

  doc.text("+ Porto und Verpackung:", 350, y);
  doc.text(`${deliveryPrice.toFixed(2)} €`, 500, y, { align: "right" });
  y += 14;

  if (order.discount && order.discount > 0) {
    doc.text("- Gutschein:", 350, y);
    doc.text(`${order.discount} %`, 500, y, { align: "right" });
    y += 14;
  }

  doc.fontSize(10).text("Gesamtsumme:", 350, y);
  doc.text(`${Number(order.totalAmount.toFixed(2))} €`, 500, y, {
    align: "right",
  });

  // ====== FOOTER ======
  doc.fontSize(8).text(
    `EuroPerfume
Saiian Vitalii
Kollwitzstraße 8 | 49808 Lingen | Deutschland
E-Mail: europerfumeshop@gmail.com

Bank: Qonto (Qonto Europe S.A.) 
IBAN: DE96 1001 0123 2124 7366 74
BIC: QNTODEB2XXX

`,
    50,
    700
  );

  doc.end();
  return done;
}
