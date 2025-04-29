-- Создание новых enum-типов, если их ещё нет
CREATE TYPE "Brands" AS ENUM (
  'CHANEL', 'DIOR', 'GUCCI', 'TOM_FORD', 'YSL', 'VERSACE', 
  'ARMANI', 'GIVENCHY', 'PRADA', 'BURBERRY', 'CALVIN_KLEIN', 
  'LACOSTE', 'HUGO_BOSS', 'RALPH_LAUREN', 'VALENTINO', 
  'BOTTEGA_VENETA', 'FENDI', 'LOUIS_VUITTON', 'SALVATORE_FERRAGAMO', 
  'MICHAEL_KORS', 'VICTORIA_SECRET'
);

CREATE TYPE "Languages" AS ENUM ('RU', 'DE');

-- Изменения в таблице Product

-- 1. Удаляем колонку "stoke" (все данные в ней будут потеряны)
ALTER TABLE "Product" DROP COLUMN "stoke";

-- 2. Добавляем колонку "available" с дефолтным значением false
ALTER TABLE "Product" ADD COLUMN "available" BOOLEAN NOT NULL DEFAULT false;

-- 3. Изменяем тип колонки "brand":
-- Если текущий тип отличается (например, это строка или старый enum "Brand"),
-- используем явное преобразование. Предположим, что в старой колонке хранился текст.
ALTER TABLE "Product" ALTER COLUMN "brand" TYPE "Brands"
  USING ("brand"::text)::"Brands";

-- 4. Изменяем тип колонки "gender":
-- Если раньше gender был массивом, а теперь требуется один enum-значение,
-- выбираем первый элемент массива (при условии, что массив не пустой).
ALTER TABLE "Product" ALTER COLUMN "gender" SET NOT NULL;
ALTER TABLE "Product" ALTER COLUMN "gender" TYPE "Gender"
  USING ("gender"[1]::"Gender");

-- 5. Удаляем старый тип "Brand", если он существует
DROP TYPE IF EXISTS "Brand";

-- Создание таблицы переводов (ProductTranslation)
CREATE TABLE "ProductTranslation" (
    "id" SERIAL NOT NULL,
    "language" "Languages" NOT NULL,
    "description" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- Создание уникального индекса для переводов
CREATE UNIQUE INDEX "ProductTranslation_language_productId_key"
ON "ProductTranslation"("language", "productId");

-- Добавляем внешний ключ для связи переводов с продуктом
ALTER TABLE "ProductTranslation"
ADD CONSTRAINT "ProductTranslation_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;