'use client';

import React, { FC } from 'react';
import { cn } from '@/src/lib/utils';
import Image from 'next/image';
import { Separator } from '../ui';
import { SocialMediaBar } from './social-media-bar';
import { links } from '@/src/shared/services/constants';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

type Props = {
  className?: string;
};

export const Footer: FC<Props> = ({ className }) => {
  const t = useTranslations('Footer');
  const locale = useLocale() as 'ru' | 'de';

  return (
    <div className={cn('flex flex-col p-3 md:p-5 border-t', className)}>
      <div className="flex flex-col gap-7 md:flex-row items-center justify-between">
        <Image src="/assets/logo.png" width={120} height={40} alt="logo" />
        <div className="flex flex-col md:flex-row md:gap-14 justify-between text-center items-center flex-1 mx-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <h3 className="text-md font-semibold">
                {link.label[locale]}
              </h3>
            </Link>
          ))}
        </div>
        <SocialMediaBar />
      </div>
      <Separator className="my-5" />
      <div className="flex items-center justify-between gap-5">
        <h5>{t('copyright')}</h5>
        <div className="flex gap-3">
          <Link href="/privacy-policy">
            <p>{t('privacy')}</p>
          </Link>
          <Link href="/impressum">
            <p>{t('impressum')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};