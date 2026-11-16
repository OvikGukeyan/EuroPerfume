"use client";

import { ArrowUp } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

/** Appears only once the shopper has scrolled down the page. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 550);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (!visible) return null;

  const label = locale === "ru" ? "Наверх страницы" : "Zurück nach oben";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" });
      }}
      className="fixed bottom-[112px] right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[#e2ded8] bg-white/95 text-[#252525] shadow-[0_3px_14px_rgba(0,0,0,0.13)] backdrop-blur-sm transition hover:bg-[#f4f1ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#252525] md:bottom-8 md:right-7"
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={1.9} />
    </button>
  );
}
