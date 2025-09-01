"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui";
import { LanguageSwitcher } from ".";

export function CookieConsentModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        <div className="flex justify-between">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={200}
            height={100}
            className="mb-4"
          />
          {/* <LanguageSwitcher className="hidden md:block" /> */}
        </div>

        <h2 className="text-xl font-bold mb-4">Cookies</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            Мы используем только обязательные cookies, необходимые для
            корректной работы сайта. Они позволяют обеспечивать безопасность,
            сохранять ваши настройки и поддерживать стабильную работу основных
            функций.
          </p>

          <p>
            Кроме того, мы применяем cookies, чтобы улучшить ваш
            пользовательский опыт — например, ускорять загрузку страниц и
            сохранять выбранные вами параметры при повторных визитах.
          </p>

          <p>
            Мы не используем сторонние маркетинговые или аналитические cookies,
            поэтому ваши данные не передаются рекламным сетям.
          </p>
        </div>
        <div className="flex flex-col justify-end gap-4 w-full mt-5">
          <Link href="/privacy-policy">
            <Button variant={"outline"} className="w-full ">
              Подробнее
            </Button>
          </Link>
          <Button
            className="bg-tertiary hover:bg-tertiary-hover"
            onClick={handleAccept}
          >
            Согласиться
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
