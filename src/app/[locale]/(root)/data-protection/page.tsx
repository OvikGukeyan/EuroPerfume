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
        <p className="mb-1">49808 Lingen</p>
        <p className="mb-3">Deutschland</p>
        <p className="mb-1">
          E-Mail:{" "}
          <a href="mailto:europerfumeshop@gmail.com" className="underline">
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 1 Allgemeine Hinweise */}
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

      {/* 2 Zugriffsdaten und Hosting */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          2. Zugriffsdaten und Hosting
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Speicherung von IP-Adresse, Datum, Uhrzeit, Browser, Betriebssystem.
          </li>
          <li>Daten werden maximal 7 Tage gespeichert.</li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 3 Vertragsabwicklung & Kontakt */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          3. Datenverarbeitung zur Vertragsabwicklung und Kontaktaufnahme
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Erhebung von Name, Anschrift, E-Mail, Telefonnummer für Bestellungen
            oder Anfragen.
          </li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</li>
          <li>
            Daten werden nach Ablauf gesetzlicher Aufbewahrungsfristen gelöscht.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 4 Kundenkonto */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Kundenkonto</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Speicherung freiwilliger Kontodaten für zukünftige Bestellungen.
          </li>
          <li>Löschung jederzeit möglich.</li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 5 Versandabwicklung */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">5. Versandabwicklung</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Datenweitergabe an Versanddienstleister (z. B. DHL).</li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 6 Zahlungsabwicklung */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">6. Zahlungsabwicklung</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Weitergabe an Zahlungsdienstleister (z. B. PayPal, Klarna).</li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 7 Newsletter */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">7. Newsletter</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Einwilligung erforderlich.</li>
          <li>Abmeldung jederzeit möglich.</li>
          <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 8 Cookies und Analyse */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">8. Cookies und Analyse</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Cookies für technische Funktionen, Analyse, Marketing.</li>
          <li>Einwilligung kann jederzeit widerrufen werden.</li>
        </ul>
        <Link href="/cookies-info" className="underline">
          Mehr Informationen
        </Link>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 9 Social Media */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">9. Social Media</h2>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">WhatsApp</p>
            <p>Anbieter: WhatsApp Ireland Limited, Dublin, Irland</p>
            <a
              href="https://www.whatsapp.com/legal/privacy-policy-eea"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://www.whatsapp.com/legal/privacy-policy-eea
            </a>
          </div>

          <div>
            <p className="font-semibold">Telegram</p>
            <p>Anbieter: Telegram Messenger LLP, Dubai, VAE</p>
            <a
              href="https://telegram.org/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://telegram.org/privacy
            </a>
          </div>

          <div>
            <p className="font-semibold">TikTok</p>
            <p>Anbieter: TikTok Technology Limited, Dublin, Irland</p>
            <a
              href="https://www.tiktok.com/legal/page/eea/privacy-policy/de"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://www.tiktok.com/legal/page/eea/privacy-policy/de
            </a>
          </div>

          <div>
            <p className="font-semibold">Facebook</p>
            <p>Anbieter: Meta Platforms Ireland Ltd., Dublin, Irland</p>
            <a
              href="https://de-de.facebook.com/policy.php"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://de-de.facebook.com/policy.php
            </a>
          </div>

          <div>
            <p className="font-semibold">Instagram</p>
            <p>Anbieter: Meta Platforms Ireland Ltd., Dublin, Irland</p>
            <a
              href="https://privacycenter.instagram.com/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              https://privacycenter.instagram.com/policy
            </a>
          </div>
        </div>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 10 Ihre Rechte */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">10. Ihre Rechte</h2>
        <p>
          Ihnen stehen die folgenden Rechte zu: Auskunft, Berichtigung,
          Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde
          (Art. 15–21, 77 DSGVO).
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* 11 Kontaktmöglichkeiten */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          11. Kontaktmöglichkeiten
        </h2>
        <p>
          Für alle Fragen zum Datenschutz schreiben Sie uns unter:{" "}
          <a href="mailto:europerfumeshop@gmail.com" className="underline">
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}
