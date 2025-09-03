'use client';

import { useTranslations } from 'next-intl';

export default function CookiesInfo() {
  const t = useTranslations('CookiesInfo');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('necessary.title')}</h2>
        <p className="mb-3">{t('necessary.description')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('necessary.items.0')}</li>
          <li>{t('necessary.items.1')}</li>
          <li>{t('necessary.items.2')}</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('experience.title')}</h2>
        <p className="mb-3">{t('experience.description')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('experience.items.0')}</li>
          <li>{t('experience.items.1')}</li>
        </ul>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('privacy.title')}</h2>
        <p className="mb-3">{t('privacy.description')}</p>
      </section>
    </div>
  );
}