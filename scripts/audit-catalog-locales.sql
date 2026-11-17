-- Read-only checks for swapped or missing storefront descriptions.
-- Brand names, perfume names and INCI are allowed to retain their original spelling.
SELECT t.id, t."productId", p.name, t.language
FROM "ProductTranslation" t
JOIN "Product" p ON p.id = t."productId"
WHERE (t.language = 'RU' AND
       (t.description !~ '[А-Яа-яЁё]' OR
        t.description ~* '\m(der Duft|die Komposition|im Herzen|ist ein|entfaltet sich|von Maison)\M'))
   OR (t.language = 'DE' AND t.description ~ '[А-Яа-яЁё]')
ORDER BY t."productId", t.language;

-- Bottle children redirect to their parent card and inherit its descriptions.
SELECT p.id, p.name, lang.language
FROM "Product" p
CROSS JOIN (VALUES ('RU'), ('DE')) lang(language)
WHERE p."bottleParentId" IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM "ProductTranslation" t
    WHERE t."productId" = p.id AND t.language::text = lang.language
  );

