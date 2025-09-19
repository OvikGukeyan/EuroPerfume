
import { Button } from '@/src/shared/components';
import Link from 'next/link';

export default function Impressum() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">Impressum</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Anbieter</h2>
        <p className="mb-2">Saiian Vitalii – Euro Perfume</p>
        <p className="mb-2">Kollwitzstraße 8</p>
        <p className="mb-2">49808 Lingen</p>
        <p className="mb-2">Deutschland</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Kontakt</h2>
        <p className="mb-2">
          E-Mail:{' '}
          <a
            href="mailto:europerfumeshop@gmail.com"
            className="underline"
          >
            europerfumeshop@gmail.com
          </a>
        </p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Rechtliche Hinweise</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Kleinunternehmer, kein Registereintrag</li>
          <li>Umsatzsteuer-ID: —</li>
          <li>
            Der Verkäufer ist weder verpflichtet noch bereit, an einem
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section>
        <h2 className="text-2xl font-semibold mb-3">
          EU-Kommission Online-Streitbeilegungsplattform (OS)
        </h2>
        <p className="mb-4">
          Die Plattform der EU-Kommission zur Online-Streitbeilegung finden Sie
          unter:{' '}
          <a
            href="http://ec.europa.eu/consumers/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            http://ec.europa.eu/consumers/odr
          </a>
        </p>

        {/* Опционально: кнопка-ссылка, в твоём стиле */}
        <Link
          href="http://ec.europa.eu/consumers/odr"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline">Zur OS-Plattform</Button>
        </Link>
      </section>
    </div>
  );
}