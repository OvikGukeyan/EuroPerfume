'use client';

import { useTranslations } from 'next-intl';

export default function Faq() {
  const t = useTranslations('Faq');

  return (
    <div className="flex flex-col items-start justify-center max-w-3xl mx-auto my-10 md:mt-40 px-4">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="mb-6 w-full">
          <h2 className="text-xl font-semibold mb-2">
            {t(`items.${i}.question`)}
          </h2>
          <p>
            {i === 3
              ? t.rich(`items.${i}.answer`, {
                  a: (chunks) => (
                    <a
                      href="mailto:europerfumeshop@gmail.com"
                      className="text-blue-600 underline"
                    >
                      {chunks}
                    </a>
                  ),
                })
              : t(`items.${i}.answer`)}
          </p>
          <hr className="my-4 border-gray-300 w-full" />
        </div>
      ))}
    </div>
  );
}