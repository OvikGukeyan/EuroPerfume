"use client";
import { useLocale } from "next-intl";
import { cookieSettingsEvent } from "@/src/shared/lib/cookie-consent";

export function CookieSettingsButton() {
  const ru = useLocale() === "ru";
  return <button type="button" className="text-sm underline underline-offset-4" onClick={() => window.dispatchEvent(new Event(cookieSettingsEvent))}>{ru ? "Настройки cookies" : "Cookie-Einstellungen"}</button>;
}
