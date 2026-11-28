"use client";
import { useEffect, useState } from "react";
import { CATALOG_VAT_HISTORY_END_MS, CATALOG_VAT_START_MS, type DayOfferWindow } from "../lib/day-offer";
// Re-render at schedule boundaries, including tabs restored from the background.
export function useDayOfferClock(offer?: DayOfferWindow | null | (DayOfferWindow | undefined)[]) {
  const [now, setNow] = useState(() => Date.now());
  const windows = Array.isArray(offer) ? offer : [offer];
  const boundaries = [CATALOG_VAT_START_MS, CATALOG_VAT_HISTORY_END_MS, ...windows.flatMap(w => [w?.dayOfferStartsAt, w?.dayOfferEndsAt])].filter(Boolean).map(t => new Date(t!).getTime()).filter(t => t > now).sort((a,b) => a-b);
  const start = boundaries[0] || 0;
  const end = boundaries[1] || 0;
  useEffect(() => {
    const update = () => setNow(Date.now());
    const next = [start, end].filter(t => t > Date.now()).sort((a,b) => a-b)[0];
    const timer = next ? setTimeout(update, Math.min(next - Date.now() + 20, 2147483647)) : undefined;
    document.addEventListener("visibilitychange", update);
    windowThis().addEventListener("focus", update);
    return () => { clearTimeout(timer); document.removeEventListener("visibilitychange", update); windowThis().removeEventListener("focus", update); };
  }, [start, end, now]);
  return now;
}
function windowThis() { return window; }
