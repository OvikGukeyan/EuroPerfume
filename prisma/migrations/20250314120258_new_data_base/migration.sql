/*
  Warnings:

  - You are about to drop the column `items` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Story` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StoryItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `contactForm` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandCountry` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturingCountry` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfumer` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryTypes" AS ENUM ('GB', 'ES', 'PBH');

-- CreateEnum
CREATE TYPE "ContactForms" AS ENUM ('WA', 'VB', 'TG');

-- CreateEnum
CREATE TYPE "Aromas" AS ENUM ('FOUGERE', 'WOODY', 'ORIENTAL', 'FLORAL', 'CITRUS', 'CHYPRE', 'LEATHER', 'AQUATIC', 'GREEN', 'GOURMAND');

-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTranslation" DROP CONSTRAINT "ProductTranslation_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoryItem" DROP CONSTRAINT "StoryItem_storyId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "items",
ADD COLUMN     "contactForm" "ContactForms" NOT NULL,
ADD COLUMN     "deliveryType" "DeliveryTypes" NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "notes",
ADD COLUMN     "aromas" "Aromas"[],
ADD COLUMN     "baseNotes" "Notes"[],
ADD COLUMN     "brandCountry" TEXT NOT NULL,
ADD COLUMN     "heartNotes" "Notes"[],
ADD COLUMN     "manufacturingCountry" TEXT NOT NULL,
ADD COLUMN     "perfumer" TEXT NOT NULL,
ADD COLUMN     "topNotes" "Notes"[];

-- DropTable
DROP TABLE "Story";

-- DropTable
DROP TABLE "StoryItem";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoritesItem" (
    "id" SERIAL NOT NULL,
    "favoritesId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "FavoritesItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desctopImg" TEXT NOT NULL,
    "tabletImg" TEXT NOT NULL,
    "mobileImg" TEXT NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_userId_key" ON "Favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Reply_reviewId_key" ON "Reply"("reviewId");

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesItem" ADD CONSTRAINT "FavoritesItem_favoritesId_fkey" FOREIGN KEY ("favoritesId") REFERENCES "Favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoritesItem" ADD CONSTRAINT "FavoritesItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
