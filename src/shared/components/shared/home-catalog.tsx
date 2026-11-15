"use client";
import { HomePriceNote } from "./home-price-note";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useFavorites } from "../../hooks";
import { ProductSelectionItem } from "./products-selection-item";
import type { HomeCatalogPage } from "../../server-lib/get-home-catalog";

export function HomeCatalog({ initialPage }: { initialPage: HomeCatalogPage }) {
  const ru = useLocale() === "ru";
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef<AbortController | null>(null);
  const { favoriteIds, addFavoritesItem } = useFavorites();
  useEffect(() => () => request.current?.abort(), []);

  async function loadMore() {
    if (request.current || page.nextCursor === null) return;
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/products/home-catalog?cursor=${page.nextCursor}`, { signal: controller.signal });
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
    <div className="home-section-heading"><div><p className="home-eyebrow">EURO PERFUME</p><h2 id="home-catalog-title">{ru ? "Все товары" : "Alle Produkte"}</h2></div><p>{ru ? "Листай коллекцию в своём темпе" : "Entdecke die Kollektion in deinem Tempo"}</p></div>
    <HomePriceNote />
    <div className="home-products-grid" aria-busy={loading}>
      {page.products.map(product => <ProductSelectionItem key={product.id} {...product} imageUrl={product.imageUrl[0] || product.variations[0]?.imageUrl || ""} concentration={product.concentration || undefined} discountPrice={product.discountPrice || undefined} isBestseller={!!product.isBestseller} isFavorite={favoriteIds.includes(product.id)} toggleIsFavorite={addFavoritesItem} />)}
    </div>
    <div className="home-load-more">
      <p role="status" aria-live="polite">{ru ? "Показано товаров: " : "Angezeigte Produkte: "}{page.products.length}</p>
      {failed && <p role="alert">{ru ? "Не удалось загрузить товары. Попробуй ещё раз." : "Die Produkte konnten nicht geladen werden. Bitte versuche es erneut."}</p>}
      {page.nextCursor !== null ? <button type="button" disabled={loading} onClick={loadMore}>{loading ? (ru ? "Загружаем…" : "Wird geladen…") : failed ? (ru ? "Попробовать ещё раз" : "Erneut versuchen") : (ru ? "Загрузить ещё" : "Mehr laden")}</button> : <p>{ru ? "Ты просмотрел все доступные товары" : "Du hast alle verfügbaren Produkte gesehen"}</p>}
    </div>
  </section>;
}
