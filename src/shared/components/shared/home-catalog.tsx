"use client";
import { offerPrices } from "../../lib/day-offer";
import { useDayOfferClock } from "../../hooks/use-day-offer";
import { LoadMoreButton } from "./load-more-button";
import { HomePriceNote } from "./home-price-note";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useFavorites } from "../../hooks";
import { ProductSelectionItem } from "./products-selection-item";
import type { HomeCatalogPage } from "../../server-lib/get-home-catalog";

export function HomeCatalog({ initialPage, sale = false }: { initialPage: HomeCatalogPage; sale?: boolean }) {
  const ru = useLocale() === "ru";
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef<AbortController | null>(null);
  const { favoriteIds, addFavoritesItem } = useFavorites();
  const now = useDayOfferClock(page.products.flatMap(p => [p, ...(p.bottles || [])]));
  const products = sale ? page.products.filter(p => p.saleBottleOnly
    ? p.bottles?.some(b => b.available && offerPrices({ ...b, price: b.regularPrice ?? b.price }, 1, false, now).discounted)
    : p.available && offerPrices(p, 2, Boolean(p.productGroup.onTap), now).discounted) : page.products;
  useEffect(() => () => request.current?.abort(), []);
  useEffect(() => {
    if (!sale) return;
    async function syncSale() {
      if (document.visibilityState !== "visible" || request.current) return;
      const controller = new AbortController();
      request.current = controller;
      try {
        const response = await fetch("/api/products/home-catalog?sale=1", { signal: controller.signal, cache: "no-store" });
        if (response.ok) { const next: HomeCatalogPage = await response.json(); if (!controller.signal.aborted) setPage(next); }
      } catch { /* Keep the current catalogue during a transient connection loss. */ }
      finally { if (request.current === controller) request.current = null; }
    }
    const timer = window.setInterval(syncSale, 60000);
    window.addEventListener("focus", syncSale);
    document.addEventListener("visibilitychange", syncSale);
    return () => { window.clearInterval(timer); window.removeEventListener("focus", syncSale); document.removeEventListener("visibilitychange", syncSale); };
  }, [sale]);

  async function loadMore() {
    if (request.current || page.nextCursor === null) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/products/home-catalog?cursor=${page.nextCursor}${sale ? "&sale=1" : ""}`, { signal: controller.signal, cache: "no-store" });
      if (!response.ok) throw new Error("Catalogue unavailable");
      const next: HomeCatalogPage = await response.json();
      if (controller.signal.aborted) return;
      setPage(previous => ({
        products: [...new Map([...previous.products, ...next.products].map(product => [product.id, product])).values()],
        nextCursor: next.nextCursor,
      }));
    } catch {
      if (!controller.signal.aborted) setFailed(true);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
      if (request.current === controller) request.current = null;
    }
  }

  return <section className="home-section" aria-labelledby="home-catalog-title">
    <div className="home-section-heading"><div><p className="home-eyebrow">EURO PERFUME</p><h2 id="home-catalog-title">{sale ? "SALE" : ru ? "Все товары" : "Alle Produkte"}</h2></div><p>{sale ? (ru ? "Товары с действующей скидкой" : "Aktuell reduzierte Artikel") : ru ? "Листай коллекцию в своём темпе" : "Entdecke die Kollektion in deinem Tempo"}</p></div>
    <HomePriceNote />
    <div className="home-products-grid" aria-busy={loading}>
      {products.map(product => <ProductSelectionItem dayOffer={product} key={product.id} {...product} preferBottle={Boolean(product.saleBottleOnly)} imageUrl={product.imageUrl[0] || product.variations[0]?.imageUrl || ""} concentration={product.concentration || undefined} discountPrice={product.discountPrice || undefined} isBestseller={!!product.isBestseller} isFavorite={favoriteIds.includes(product.id)} toggleIsFavorite={addFavoritesItem} />)}
    </div>
    {sale && products.length === 0 && <p className="py-10 text-center text-sm text-neutral-600">{ru ? "Сейчас товаров с действующей скидкой нет." : "Aktuell sind keine reduzierten Artikel verfügbar."}</p>}
    <div className="home-load-more">
      <p role="status" aria-live="polite">{ru ? "Показано товаров: " : "Angezeigte Produkte: "}{products.length}</p>
      {failed && <p role="alert">{ru ? "Не удалось загрузить товары. Попробуй ещё раз." : "Die Produkte konnten nicht geladen werden. Bitte versuche es erneut."}</p>}
      {page.nextCursor !== null ? <LoadMoreButton disabled={loading} onClick={loadMore}>{loading ? (ru ? "Загружаем…" : "Wird geladen…") : failed ? (ru ? "Попробовать ещё раз" : "Erneut versuchen") : (ru ? "Загрузить ещё" : "Mehr laden")}</LoadMoreButton> : <p>{ru ? "Ты просмотрел все доступные товары" : "Du hast alle verfügbaren Produkte gesehen"}</p>}
    </div>
  </section>;
}
