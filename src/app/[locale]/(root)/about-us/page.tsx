'use client';

import { useTranslations } from 'next-intl';

export default function AboutUs() {
  const t = useTranslations('AboutUs');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      {/* Intro */}
      <section className="mb-10">
        <p className="mb-3">{t('intro.p1')}</p>
        <p className="mb-3">{t('intro.p2')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Brands */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('brands.title')}</h2>
        <p className="mb-3">{t('brands.intro')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          {Array.from({ length: 9 }, (_, i) => (
            <li key={i}>{t(`brands.items.${i}`)}</li>
          ))}
        </ul>
        <p className="text-sm text-gray-600">{t('brands.footer')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Decants */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('decants.title')}</h2>
        <p className="mb-3">{t('decants.text')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Why us */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('why.title')}</h2>
        <ul className="list-disc list-inside space-y-2 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i}>{t(`why.items.${i}`)}</li>
          ))}
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Shipping */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('shipping.title')}</h2>
        <p className="mb-3">{t('shipping.text')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Contact */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('contact.title')}</h2>
        <p className="mb-3">{t('contact.text')}</p>
        <p>
          E-Mail:{' '}
          <a
            href={`mailto:${t('contact.email')}`}
            className="underline text-blue-600"
          >
            {t('contact.email')}
          </a>
        </p>
      </section>
    </div>
  );
}