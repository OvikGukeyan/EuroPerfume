"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { CookieConsent, consentEvent, readCookieConsent } from "@/src/shared/lib/cookie-consent";

export function OptionalAnalytics() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  useEffect(() => {
    let previous = readCookieConsent();
    setConsent(previous);
    const update = (event: Event) => { previous = (event as CustomEvent<CookieConsent>).detail; setConsent(previous); };
    const storage = () => {
      const current = readCookieConsent();
      if ((previous?.analytics && !current?.analytics) || (previous?.marketing && !current?.marketing) || (previous?.preferences && !current?.preferences)) location.reload();
      previous = current; setConsent(current);
    };
    window.addEventListener(consentEvent, update); window.addEventListener("storage", storage);
    return () => { window.removeEventListener(consentEvent, update); window.removeEventListener("storage", storage); };
  }, []);
  return <>
    {consent?.analytics && <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-YWQF5HZNPJ" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-YWQF5HZNPJ');`}</Script>
    </>}
    {consent?.marketing && <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','1773687239874744');fbq('track','PageView');`}</Script>}
  </>;
}
