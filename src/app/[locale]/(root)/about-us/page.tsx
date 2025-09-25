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
        <p className="mb-3">{t('brands.description')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('brands.items.0')}</li>
          <li>{t('brands.items.1')}</li>
          <li>{t('brands.items.2')}</li>
          <li>{t('brands.items.3')}</li>
          <li>{t('brands.items.4')}</li>
          <li>{t('brands.items.5')}</li>
          <li>{t('brands.items.6')}</li>
          <li>{t('brands.items.7')}</li>
          <li>{t('brands.items.8')}</li>
        </ul>
        <p className="text-sm text-gray-600">{t('brands.more')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Cosmetics */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('cosmetics.title')}</h2>
        <p className="mb-3">{t('cosmetics.description')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Decants / Feature */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('decants.title')}</h2>
        <p className="mb-3">{t('decants.description')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Why us */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('why.title')}</h2>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('why.items.0')}</li>
          <li>{t('why.items.1')}</li>
          <li>{t('why.items.2')}</li>
          <li>{t('why.items.3')}</li>
          <li>{t('why.items.4')}</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Loyalty */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('loyalty.title')}</h2>
        <p className="mb-3">{t('loyalty.p1')}</p>
        <p className="mb-3">{t('loyalty.p2')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Shipping */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('shipping.title')}</h2>
        <p className="mb-3">{t('shipping.intro')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('shipping.items.0')}</li>
          <li>{t('shipping.items.1')}</li>
          <li>{t('shipping.items.2')}</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Consultation */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('consultation.title')}</h2>
        <p className="mb-3">{t('consultation.description')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      {/* Closing */}
      <section>
        <p className="mb-3">{t('closing')}</p>
      </section>
    </div>
  );
}