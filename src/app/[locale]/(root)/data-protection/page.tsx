import { Link } from "@/src/i18n/navigation";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Datenschutzerklärung</h1>

      {/* Verantwortlicher */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Verantwortlicher</h2>
        <p className="mb-1">Saiian Vitalii – Euro Perfume</p>
        <p className="mb-1">Kollwitzstraße 8</p>
        <p className="mb-1">49808 Lingen, Deutschland</p>
        <p className="mb-3">
          E-Mail:{" "}
          <a href="mailto:europerfumeshop@gmail.com" className="underline">
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 1. Allgemeine Hinweise */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">1. Allgemeine Hinweise</h2>
        <p>
          Der Schutz Ihrer Privatsphäre ist uns sehr wichtig. Nachstehend
          informieren wir Sie ausführlich über den Umgang mit Ihren
          personenbezogenen Daten beim Besuch unserer Webseite{" "}
          <span className="font-medium">www.euro-perfume.com</span>.
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 2. Zugriffsdaten und Hosting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          2. Zugriffsdaten und Hosting
        </h2>
        <p className="mb-2">
          Unser Hosting erfolgt bei <span className="italic">[Name des Hosting-Anbieters]</span>.
        </p>
        <p className="mb-2">
          Beim Aufruf unserer Website werden automatisch Zugriffsdaten
          (IP-Adresse, Datum, Uhrzeit, Browser, Betriebssystem) gespeichert.
        </p>
        <p className="mb-2">Diese Daten werden maximal 7 Tage aufbewahrt.</p>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 3. Vertragsabwicklung & Kontakt */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          3. Datenverarbeitung zur Vertragsabwicklung und Kontaktaufnahme
        </h2>
        <p className="mb-2">
          Zur Abwicklung von Bestellungen oder Anfragen erheben wir Name,
          Anschrift, E-Mail und Telefonnummer.
        </p>
        <p className="mb-2">Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
        <p>Die Daten werden nach Ablauf der gesetzlichen Aufbewahrungsfristen gelöscht.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 4. Kundenkonto */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Kundenkonto</h2>
        <p className="mb-2">
          Freiwillig angelegte Kundenkonten werden gespeichert, bis Sie deren
          Löschung verlangen.
        </p>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 5. Versandabwicklung */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Versandabwicklung</h2>
        <p className="mb-2">
          Zur Lieferung geben wir Daten an Versanddienstleister (z. B. DHL)
          weiter.
        </p>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 6. Zahlungsabwicklung */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Zahlungsabwicklung</h2>
        <p className="mb-2">
          Zur Zahlungsabwicklung geben wir Daten an Zahlungsdienstleister
          (z. B. PayPal, Klarna) weiter.
        </p>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 7. Newsletter */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Newsletter</h2>
        <p>Derzeit bieten wir keinen Newsletter-Versand an.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 8. Cookies und Analyse */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Cookies und Analyse</h2>
        <p className="mb-2">
          Wir verwenden ausschließlich technisch notwendige Cookies. Eine
          weitergehende Analyse oder Tracking erfolgt nicht.
        </p>
        <p>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 9. Social Media */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">9. Social Media</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>WhatsApp – Datenschutzerklärung</li>
          <li>Telegram – Datenschutzerklärung</li>
          <li>TikTok – Datenschutzerklärung</li>
          <li>Facebook – Datenschutzerklärung</li>
          <li>Instagram – Datenschutzerklärung</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 10. Ihre Rechte */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">10. Ihre Rechte</h2>
        <p>
          Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung,
          Einschränkung, Datenübertragbarkeit, Widerspruch sowie Beschwerde
          gemäß Art. 15 – 21, 77 DSGVO.
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 11. Kontaktmöglichkeiten */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">11. Kontaktmöglichkeiten</h2>
        <p>
          Für alle Fragen zum Datenschutz schreiben Sie uns bitte an:{" "}
          <a href="mailto:europerfumeshop@gmail.com" className="underline">
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}