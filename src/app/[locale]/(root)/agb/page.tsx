'use client';

import { useTranslations } from 'next-intl';

export default function AGBPage() {
  const t = useTranslations('AGB');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('section1')}</h2>

        <h3 className="text-xl font-semibold mb-2">{t('1_1')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('1_1_1')}</li>
          <li>{t('1_1_2')}</li>
          <li>{t('1_1_3')}</li>
          <li>{t('1_1_4')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('1_2')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('1_2_1')}</li>
          <li>{t('1_2_2')}</li>
          <li>{t('1_2_3')}</li>
          <li>{t('1_2_4')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('1_3')}</h3>
        <p className="mb-4">{t('1_3_1')}</p>

        <h3 className="text-xl font-semibold mb-2">{t('1_4')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('1_4_1')}</li>
          <li>{t('1_4_2')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('1_5')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('1_5_1')}</li>
          <li>{t('1_5_2')}</li>
          <li>{t('1_5_3')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('1_6')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('1_6_1')}</li>
          <li>{t('1_6_2')}</li>
          <li>{t('1_6_3')}</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('section2')}</h2>

        <h3 className="text-xl font-semibold mb-2">{t('2_1')}</h3>
        <p className="mb-4">
          Euro Perfume<br />
          Email: <a href="mailto:europerfumeshop@gmail.com" className="text-blue-600 underline">europerfumeshop@gmail.com</a><br />
          {t('2_1_1')}{' '}
          <a
            href="https://ec.europa.eu/odr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            https://ec.europa.eu/odr
          </a>
        </p>

        <h3 className="text-xl font-semibold mb-2">{t('2_2')}</h3>
        <p className="mb-4">{t('2_2_1')}</p>

        <h3 className="text-xl font-semibold mb-2">{t('2_3')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('2_3_1')}</li>
          <li>{t('2_3_2')}</li>
          <li>{t('2_3_3')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('2_4')}</h3>
        <p className="mb-4">{t('2_4_1')}</p>

        <h3 className="text-xl font-semibold mb-2">{t('2_5')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('2_5_1')}</li>
          <li>{t('2_5_2')}</li>
          <li>{t('2_5_3')}</li>
          <li>{t('2_5_4')}</li>
          <li>{t('2_5_5')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('2_6')}</h3>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>{t('2_6_1')}</li>
          <li>{t('2_6_2')}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-2">{t('2_7')}</h3>
        <p className="mb-4">{t('2_7_1')}</p>
      </section>
    </div>
  );
}