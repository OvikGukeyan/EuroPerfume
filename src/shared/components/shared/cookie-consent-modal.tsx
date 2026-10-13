"use client";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { cookieSettingsEvent, readCookieConsent, saveCookieConsent } from "@/src/shared/lib/cookie-consent";

export function CookieConsentModal() {
  const ru = useLocale() === "ru";
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const saved = readCookieConsent();
    setAnalytics(saved?.analytics ?? false); setMarketing(saved?.marketing ?? false); setPreferences(saved?.preferences ?? false); setOpen(!saved);
    const show = () => { const current = readCookieConsent(); setAnalytics(current?.analytics ?? false); setMarketing(current?.marketing ?? false); setPreferences(current?.preferences ?? false); setOpen(true); };
    window.addEventListener(cookieSettingsEvent, show);
    return () => window.removeEventListener(cookieSettingsEvent, show);
  }, []);
  useEffect(() => { if (open) panel.current?.focus(); }, [open]);
  function choose(a: boolean, m: boolean, p: boolean) { saveCookieConsent(a, m, p); setOpen(false); }
  function trap(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const elements = panel.current?.querySelectorAll<HTMLElement>('button, input:not([disabled]), a[href]');
    if (!elements?.length) return;
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
      <div ref={panel} tabIndex={-1} onKeyDown={trap} role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" aria-describedby="cookie-modal-description" className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 id="cookie-modal-title" className="text-xl font-semibold">{ru ? "Настройки cookies" : "Cookie-Einstellungen"}</h2><LanguageSwitcher /></div>
        <p id="cookie-modal-description" className="mb-5 text-sm leading-relaxed">{ru ? "Обязательные cookies обеспечивают корзину, вход в аккаунт и сохранение настроек. История просмотренных ароматов, аналитика Google Analytics и маркетинг Meta Pixel включаются только с вашего согласия. Выбор можно изменить в любой момент." : "Notwendige Cookies ermöglichen Warenkorb, Anmeldung und Einstellungen. Der Verlauf angesehener Düfte, Google Analytics und Meta Pixel werden nur mit Ihrer Einwilligung aktiviert. Sie können Ihre Auswahl jederzeit ändern."}</p>
        <div className="space-y-4">
          <label className="flex items-start gap-3"><input type="checkbox" checked disabled className="mt-1" /><span>{ru ? "Обязательные — всегда активны" : "Notwendig — immer aktiv"}</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" checked={preferences} onChange={e => setPreferences(e.target.checked)} className="mt-1" /><span>{ru ? "Удобство — история просмотренных ароматов" : "Komfort — zuletzt angesehene Düfte"}</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" checked={analytics} onChange={e => setAnalytics(e.target.checked)} className="mt-1" /><span>{ru ? "Аналитика — Google Analytics" : "Analyse — Google Analytics"}</span></label>
          <label className="flex items-start gap-3"><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)} className="mt-1" /><span>{ru ? "Маркетинг — Meta Pixel" : "Marketing — Meta Pixel"}</span></label>
        </div>
        <Link href="/data-protection" onClick={() => setOpen(false)} className="my-5 inline-block text-sm underline">{ru ? "Политика конфиденциальности" : "Datenschutzerklärung"}</Link>
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => choose(false, false, false)} className="rounded-md border border-gray-900 px-4 py-3 font-medium">{ru ? "Только обязательные" : "Nur notwendige"}</button>
          <button type="button" onClick={() => choose(true, true, true)} className="rounded-md border border-gray-900 px-4 py-3 font-medium">{ru ? "Разрешить все" : "Alle erlauben"}</button>
          <button type="button" onClick={() => choose(analytics, marketing, preferences)} className="rounded-md bg-gray-900 px-4 py-3 font-medium text-white">{ru ? "Сохранить выбор" : "Auswahl speichern"}</button>
        </div>
      </div>
    </div>, document.body,
  );
}
