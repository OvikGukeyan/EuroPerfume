"""Generate the printable and interactive statutory withdrawal form.
Requires reportlab and pypdf. No production service or database connection is used.
"""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
import reportlab

root = Path(__file__).resolve().parents[1]
fonts = Path('/usr/share/fonts/truetype/dejavu')
if (fonts / 'DejaVuSans.ttf').exists():
    regular, bold = fonts / 'DejaVuSans.ttf', fonts / 'DejaVuSans-Bold.ttf'
else:
    fonts = Path(reportlab.__file__).parent / 'fonts'
    regular, bold = fonts / 'Vera.ttf', fonts / 'VeraBd.ttf'
pdfmetrics.registerFont(TTFont('FormSans', str(regular)))
pdfmetrics.registerFont(TTFont('FormSansBold', str(bold)))
path = root / 'public/withdrawal-form.pdf'
c = canvas.Canvas(str(path), pagesize=A4)
c.setTitle('EURO PERFUME - Muster-Widerrufsformular')
c.setAuthor('EURO PERFUME')
c.setFont('FormSansBold', 20)
c.drawString(48, 791, 'Muster-Widerrufsformular')
c.setFont('FormSans', 9)
c.drawString(48, 768, 'Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular ausfüllen')
c.drawString(48, 754, 'und an uns zurücksenden. Die Verwendung dieses Formulars ist nicht vorgeschrieben.')
c.setFont('FormSansBold', 11)
c.drawString(48, 726, 'An:')
c.setFont('FormSans', 10)
for i, line in enumerate(['EURO PERFUME', 'Vitalii Saiian', 'Schillerstrasse 40', '49811 Lingen', 'Deutschland', 'E-Mail: europerfumeshop@gmail.com']):
    c.drawString(48, 707 - i * 15, line)
c.setFont('FormSans', 9)
c.drawString(48, 596, 'Hiermit widerrufe ich / widerrufen wir den von mir / uns abgeschlossenen Vertrag')
c.drawString(48, 582, 'über den Kauf der folgenden Waren (ggf. Bestellnummer angeben):')
form = c.acroForm
style = dict(borderColor=colors.HexColor('#9ca3af'), fillColor=colors.white, textColor=colors.black, fontName='Helvetica', fontSize=10, borderWidth=0.7, forceBorder=True)
def field(name, label, x, y, width, height=26, multiline=False):
    c.setFont('FormSansBold', 9)
    c.drawString(x, y + height + 8, label)
    form.textfield(name=name, tooltip=label, x=x, y=y, width=width, height=height, fieldFlags='multiline' if multiline else '', **style)
form.textfield(name='goods', tooltip='Waren und gegebenenfalls Bestellnummer', x=48, y=513, width=499, height=57, fieldFlags='multiline', **style)
field('ordered_at', 'Bestellt am', 48, 461, 238)
field('received_at', 'Erhalten am', 309, 461, 238)
field('consumer_name', 'Name des Verbrauchers / der Verbraucher', 48, 408, 499)
field('consumer_address', 'Anschrift des Verbrauchers / der Verbraucher', 48, 329, 499, 52, True)
field('date', 'Datum', 48, 277, 238)
c.setFont('FormSansBold', 9)
c.drawString(48, 245, 'Unterschrift (nur bei Mitteilung auf Papier)')
c.setStrokeColor(colors.HexColor('#9ca3af'))
c.line(48, 217, 547, 217)
c.setFont('FormSans', 8)
c.setFillColor(colors.HexColor('#4b5563'))
c.drawString(48, 177, 'Sie können Ihren Widerruf auch unmittelbar per E-Mail oder über die elektronische')
c.drawString(48, 163, 'Widerrufsfunktion auf unserer Website erklären. Ein Kundenkonto ist nicht erforderlich.')
c.setFont('FormSansBold', 9)
c.drawString(48, 131, 'Vertrag widerrufen:')
c.setFont('FormSans', 8)
url = 'https://euro-perfume-inky.vercel.app/de/withdrawal'
c.drawString(48, 116, url)
c.linkURL(url, (48, 110, 547, 129), relative=0)
c.setStrokeColor(colors.HexColor('#d1d5db'))
c.line(48, 83, 547, 83)
c.setFont('FormSans', 8)
c.drawString(48, 65, 'EURO PERFUME | Schillerstrasse 40 | 49811 Lingen | Deutschland')
c.save()
reader = PdfReader(path)
expected = {'goods', 'ordered_at', 'received_at', 'consumer_name', 'consumer_address', 'date'}
fields = reader.get_fields() or {}
assert set(fields) == expected
widgets = [a.get_object() for page in reader.pages for a in page.get('/Annots', []) if a.get_object().get('/Subtype') == '/Widget']
assert len(widgets) == len(expected)
assert all(field.get('/V', '') == '' for field in fields.values())
assert all(widget.get('/AP', {}).get('/N') for widget in widgets)
assert len(reader.pages) == 1
print('Verified: one page, six interactive fields, embedded label fonts.')
