import { Button } from "@/src/shared/components";
import Link from "next/link";

export default function Impressum() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Impressum</h1>

      {/* Angaben gemäß § 5 TMG */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Angaben gemäß § 5 TMG</h2>
        <p className="mb-2">Saiian Vitalii – Euro Perfume</p>
        <p className="mb-2">Kollwitzstraße 8</p>
        <p className="mb-2">49808 Lingen</p>
        <p className="mb-2">Deutschland</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Kontakt */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Kontakt</h2>
        <p className="mb-2">Telefon: +49 1523 1651047</p>
        <p>
          E-Mail:{" "}
          <a
            href="mailto:europerfumeshop@gmail.com"
            className="underline"
          >
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Vertreten durch */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Vertreten durch</h2>
        <p>Saiian Vitalii</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Umsatzsteuer-ID */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Umsatzsteuer-ID</h2>
        <p>
          Keine Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG
          (Kleinunternehmer gemäß § 19 UStG, daher ohne USt-ID).
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Registereintrag */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Registereintrag</h2>
        <p>Kein Registereintrag (Einzelunternehmen / Kleinunternehmer).</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Haftungsausschluss */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Haftungsausschluss</h2>
        <p>
          Der Betreiber dieser Website übernimmt keine Haftung für Inhalte
          externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich
          deren Betreiber verantwortlich.
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Hinweis zu Marken */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          Wichtiger Hinweis zu Marken
        </h2>
        <p className="mb-2">
          Diese Website und deren Betreiber sind unabhängig und nicht mit den
          genannten Parfummarken assoziiert, verbunden oder von diesen
          autorisiert.
        </p>
        <p className="mb-2">
          Die genannten Marken sind Eigentum ihrer jeweiligen Rechteinhaber.
        </p>
        <p>
          Der Verkauf von Parfumproben (Decants) erfolgt als Service für
          Parfumenthusiasten und stellt keine offizielle Vermarktung der
          Markenprodukte dar.
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Online-Streitbeilegung */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">
          Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO
        </h2>
        <p className="mb-4">
          Die Europäische Kommission stellt eine Plattform zur
          Online-Streitbeilegung (OS) bereit:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            https://ec.europa.eu/consumers/odr
          </a>
        </p>
        <p>
          Wir sind weder verpflichtet noch bereit, an einem
          Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>

        <div className="mt-6">
          <Link
            href="https://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">Zur OS-Plattform</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}