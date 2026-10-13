export type CookieConsent = { analytics: boolean; marketing: boolean; preferences: boolean; version: 1; savedAt: string };
export const consentStorageKey = "euro-perfume-cookie-consent-v1";
export const consentEvent = "euro-perfume:consent-changed";
export const cookieSettingsEvent = "euro-perfume:cookie-settings";
let sessionConsent: CookieConsent | null = null;

export function readCookieConsent(): CookieConsent | null {
  try {
    const value = JSON.parse(localStorage.getItem(consentStorageKey) ?? "null");
    return value?.version === 1 && typeof value.analytics === "boolean" && typeof value.marketing === "boolean" && typeof value.preferences === "boolean" ? value : sessionConsent;
  } catch { return sessionConsent; }
}

export function saveCookieConsent(analytics: boolean, marketing: boolean, preferences: boolean) {
  const previous = readCookieConsent();
  const next: CookieConsent = { analytics, marketing, preferences, version: 1, savedAt: new Date().toISOString() };
  sessionConsent = next;
  try { localStorage.setItem(consentStorageKey, JSON.stringify(next)); } catch { /* Choices still apply to this page. */ }
  if (!preferences) { try { localStorage.removeItem("recentlyViewed"); } catch {} }
  window.dispatchEvent(new CustomEvent(consentEvent, { detail: next }));
  if ((previous?.analytics && !analytics) || (previous?.marketing && !marketing) || (previous?.preferences && !preferences)) {
    for (const item of document.cookie.split(";")) {
      const name = item.split("=")[0].trim();
      if ((!analytics && /^(_ga|_gid|_gat)/.test(name)) || (!marketing && /^(_fbp|_fbc)$/.test(name))) {
        document.cookie = `${name}=; Max-Age=0; Path=/`;
        const parts = location.hostname.split(".");
        for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${parts.slice(i).join(".")}`;
      }
    }
    location.reload();
  }
}
