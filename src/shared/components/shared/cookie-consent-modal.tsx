"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Button } from "../ui";
import { LanguageSwitcher } from ".";
import { Link } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";

export function CookieConsentModal() {
  const t = useTranslations("CookieConsent"); // <- namespace переводов
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // показываем модалку только если еще нет согласия
    const consent = typeof window !== "undefined" && localStorage.getItem("cookieConsent");
    if (!consent) setIsOpen(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg">
        <div className="flex justify-between">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={200}
            height={100}
            className="mb-4"
            priority
          />
          <LanguageSwitcher className="hidden md:block" />
        </div>

        <h2 id="cookie-modal-title" className="text-xl font-bold mb-4">
          {t("title")}
        </h2>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>

        <div className="flex flex-col justify-end gap-4 w-full mt-5">
          <Link href="/cookies-info">
            <Button variant="outline" className="w-full">
              {t("more")}
            </Button>
          </Link>

          <Button
            className="bg-tertiary hover:bg-tertiary-hover"
            onClick={handleAccept}
          >
            {t("accept")}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}