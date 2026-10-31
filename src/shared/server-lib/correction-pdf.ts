import PDFDocument from 'pdfkit';
import path from 'path';
import { CorrectionSnapshot, euro } from '../lib/invoice-correction';

export async function correctionPdf(s: CorrectionSnapshot, draft = false): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: true, info: { Title: draft ? 'ENTWURF - Rechnungskorrektur' : s.number } });
  doc.registerFont('Regular', path.join(process.cwd(), 'public/fonts/DejaVuSans.ttf'));
  doc.registerFont('Bold', path.join(process.cwd(), 'public/fonts/DejaVuSans-Bold.ttf'));
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
  });
  const left = 50, right = 545, width = right - left, bottom = 700;
  const date = (v: string) => new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin' }).format(new Date(v));
  const title = s.mode === 'full' ? 'Stornorechnung' : 'Teilstornorechnung';
  const regular = (size = 9) => doc.font('Regular').fontSize(size).fillColor('#111111');
  function header() {
    doc.image(path.join(process.cwd(), 'public/assets/logo.png'), left, 38, { fit: [125, 45] });
    if (draft) doc.font('Bold').fontSize(10).fillColor('#8a4b41').text('ENTWURF - NICHT AUSGESTELLT', 280, 45, { width: 265, align: 'right' });
    regular();
    doc.y = 105;
  }
  function nextPage() {
    doc.addPage(); header();
    doc.font('Bold').fontSize(13).text(title, left, 100, { width });
    regular(8).text(`Bezug: ${s.originalNumber} | ${draft ? 'Entwurf' : s.number}`, left, 122, { width });
    doc.y = 150;
  }
  function paragraph(value: string, size = 9) {
    regular(size);
    const h = doc.heightOfString(value, { width, lineGap: 2 });
    if (doc.y + h > bottom) nextPage();
    regular(size).text(value, left, doc.y, { width, lineGap: 2 });
  }
  header();
  regular().text(s.seller, left, 120, { width: 230 });
  const sellerBottom = doc.y;
  regular().text(`Rechnungsadresse:\n${s.baseline.customer}`, 350, 120, { width: 195 });
  doc.y = Math.max(sellerBottom, doc.y) + 36;
  doc.font('Regular').fontSize(18).text(title, left, doc.y, { width });
  doc.moveDown(0.5);
  paragraph(`Stornonummer: ${draft ? 'Wird erst bei Ausstellung vergeben' : s.number}\nAusstellungsdatum: ${date(s.issuedAt)}\nUrsprüngliche Rechnung: ${s.originalNumber} vom ${date(s.originalDate)}\nBestellnummer: ${s.orderId}`);
  doc.moveDown(); paragraph(`Grund: ${s.reason}`);
  if (s.previousNumbers.length) { doc.moveDown(0.5); paragraph(`Bereits berücksichtigte Korrekturen: ${s.previousNumbers.join(', ')}`, 8); }
  doc.moveDown(1.5);
  function tableHeader() {
    const y = doc.y;
    regular().text('Pos.', left, y, { width: 30 });
    regular().text('Artikel / Korrektur', 90, y, { width: 325 });
    regular().text('Gesamtbetrag', 425, y, { width: 120, align: 'right' });
    doc.moveTo(left, y + 17).lineTo(right, y + 17).lineWidth(1).strokeColor('#111111').stroke();
    doc.y = y + 28;
  }
  if (doc.y > bottom - 70) nextPage();
  tableHeader();
  s.lines.forEach((line, i) => {
    regular();
    const h = Math.max(18, doc.heightOfString(line.description, { width: 325, lineGap: 2 }));
    if (doc.y + h + 12 > bottom) { nextPage(); tableHeader(); }
    const y = doc.y;
    regular().text(String(i + 1), left, y, { width: 30 });
    regular().text(line.description, 90, y, { width: 325, lineGap: 2 });
    regular().text(euro(-line.grossCents), 425, y, { width: 120, align: 'right' });
    doc.y = y + h + 12;
  });
  if (doc.y + 165 > bottom) nextPage();
  doc.y += 12;
  const summaryY = doc.y;
  doc.moveTo(295, summaryY).lineTo(right, summaryY).lineWidth(1).stroke();
  doc.y = summaryY + 12;
  if (s.baseline.mode === 'vat') {
    regular().text(`Nettokorrektur: ${euro(-s.netCents)}\nUmsatzsteuer (${s.baseline.rateBasisPoints / 100} %): ${euro(-s.vatCents)}`, 295, doc.y, { width: 250, align: 'right', lineGap: 3 });
  } else {
    regular(8).text('Steuerbefreit gemäß § 19 Abs. 1 UStG.\nUmsatzsteuer wird nicht ausgewiesen.', 295, doc.y, { width: 250, lineGap: 2 });
  }
  doc.y += 12;
  const totalY = doc.y;
  doc.font('Bold').fontSize(10).text('Korrekturbetrag:', 295, totalY, { width: 135 });
  doc.text(euro(-s.grossCents), 430, totalY, { width: 115, align: 'right' });
  doc.y = totalY + 38;
  paragraph('Dieses Dokument korrigiert die oben genannte Rechnung. Es bestätigt keine bereits erfolgte Rückzahlung. Die Zahlungsabwicklung erfolgt separat.', 8);
  const pages = doc.bufferedPageRange();
  for (let i = pages.start; i < pages.start + pages.count; i++) {
    doc.switchToPage(i);
    doc.moveTo(left, 741).lineTo(right, 741).lineWidth(0.4).strokeColor('#bbbbbb').stroke();
    regular(7).text(`${s.seller.replace(/\n/g, ' | ')}\nUSt-IdNr.: ${s.sellerVatId}`, left, 752, { width: 400, lineGap: 2 });
    regular(7).text(`Seite ${i + 1} / ${pages.count}`, 465, 752, { width: 80, align: 'right' });
  }
  doc.end(); return done;
}
