import PDFDocument from 'pdfkit';
import path from 'path';
import { CorrectionSnapshot, euro } from '../lib/invoice-correction';

export async function correctionPdf(s: CorrectionSnapshot, draft = false): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 48, info: { Title: draft ? 'ENTWURF – Rechnungskorrektur' : s.number } });
  doc.registerFont('Regular', path.join(process.cwd(), 'public/fonts/DejaVuSans.ttf'));
  doc.registerFont('Bold', path.join(process.cwd(), 'public/fonts/DejaVuSans-Bold.ttf'));
  const chunks: Buffer[] = [];
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', chunk => chunks.push(chunk)); doc.on('end', () => resolve(Buffer.concat(chunks))); doc.on('error', reject);
  });
  const date = (v: string) => new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin' }).format(new Date(v));
  const text = (v: string, size = 10) => doc.font('Regular').fontSize(size).text(v, { lineGap: 3 });
  doc.font('Bold').fontSize(18).text(draft ? 'ENTWURF – NICHT AUSGESTELLT' : s.mode === 'full' ? 'Stornorechnung' : 'Teilstornorechnung');
  doc.moveDown(); text(s.seller); if (s.baseline.mode === 'vat') text(`USt-IdNr.: ${s.sellerVatId}`);
  doc.moveDown(); text(`Rechnungsempfänger:\n${s.baseline.customer}`);
  doc.moveDown();
  text(`Dokumentnummer: ${draft ? 'Wird erst bei Ausstellung vergeben' : s.number}\nAusstellungsdatum: ${date(s.issuedAt)}\nBezug: Rechnung ${s.originalNumber} vom ${date(s.originalDate)}\nBestellung: ${s.orderId}`);
  doc.moveDown(); text(`Grund: ${s.reason}`);
  if (s.previousNumbers.length) text(`Bereits berücksichtigte Korrekturen: ${s.previousNumbers.join(', ')}`);
  doc.moveDown();
  s.lines.forEach((line, i) => {
    if (doc.y > 690) doc.addPage();
    text(`${i + 1}. ${line.description}`); doc.font('Bold').fontSize(11).text(euro(-line.grossCents), { align: 'right' }); doc.moveDown(0.5);
  });
  if (doc.y > 620) doc.addPage();
  doc.moveDown();
  if (s.baseline.mode === 'vat') {
    text(`Nettokorrektur: ${euro(-s.netCents)}\nUmsatzsteuer (${s.baseline.rateBasisPoints / 100} %): ${euro(-s.vatCents)}`);
  } else text('Steuerbefreiung für Kleinunternehmer gemäß § 19 UStG. Keine Umsatzsteuer ausgewiesen.');
  doc.font('Bold').fontSize(13).text(`Korrekturbetrag: ${euro(-s.grossCents)}`);
  doc.moveDown(); text('Dieses Dokument korrigiert die oben genannte Rechnung. Es bestätigt keine bereits erfolgte Rückzahlung. Die Zahlungsabwicklung erfolgt separat.');
  doc.end(); return done;
}
