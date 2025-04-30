'use client';

import { useTranslations } from 'next-intl';

export default function PaymentInfoPage() {
  const t = useTranslations('PaymentInfo');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t('delivery.title')}</h2>
        <p className="mb-3">{t('delivery.description')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('delivery.items.0')}</li>
          <li>{t('delivery.items.1')}</li>
          <li>{t('delivery.items.2')}</li>
          <li>{t('delivery.items.3')}</li>
          <li>{t('delivery.items.4')}</li>
        </ul>
        <p>{t('delivery.tracking')}</p>
      </section>

      <hr className="my-8 border-t border-gray-300" />

      <section>
        <h2 className="text-2xl font-semibold mb-4">{t('payment.title')}</h2>
        <p className="mb-3">{t('payment.description')}</p>
        <ul className="list-disc list-inside space-y-2 mb-3">
          <li>{t('payment.methods.0')}</li>
          <li>{t('payment.methods.1')}</li>
          <li>{t('payment.methods.2')}</li>
        </ul>
        <p>{t('payment.notice')}</p>
      </section>
    </div>
  );
}