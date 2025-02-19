/*
  Warnings:

  - You are about to drop the column `productItemId` on the `CartItem` table. All the data in the column will be lost.
  - You are about to drop the `Ingredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartItemToIngredient` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_IngredientToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brand` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `concentration` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `releaseYear` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stoke` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `VerificationCode` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'UNISEX');

-- CreateEnum
CREATE TYPE "PerfumeConcentration" AS ENUM ('EXTRAIT', 'PERFUME', 'EAU_DE_PARFUM', 'EAU_DE_TOILETTE', 'EAU_DE_COLOGNE');

-- CreateEnum
CREATE TYPE "Notes" AS ENUM ('CITRUS', 'FLORAL', 'GREEN', 'FRUITY', 'SPICY', 'WOODY', 'ORIENTAL', 'MUSK', 'AQUATIC');

-- CreateEnum
CREATE TYPE "Types" AS ENUM ('NICHE', 'ARABIAN', 'DESIGNER', 'CELEBRITY', 'INDIE');

-- CreateEnum
CREATE TYPE "Brand" AS ENUM ('CHANEL', 'DIOR', 'GUCCI', 'TOM_FORD', 'YSL', 'VERSACE', 'ARMANI', 'GIVENCHY', 'PRADA', 'BURBERRY', 'CALVIN_KLEIN', 'LACOSTE', 'HUGO_BOSS', 'RALPH_LAUREN', 'VALENTINO', 'BOTTEGA_VENETA', 'FENDI', 'LOUIS_VUITTON', 'SALVATORE_FERRAGAMO', 'MICHAEL_KORS', 'VICTORIA_SECRET');

-- DropForeignKey
ALTER TABLE "CartItem" DROP CONSTRAINT "CartItem_productItemId_fkey";

-- DropForeignKey
ALTER TABLE "ProductItem" DROP CONSTRAINT "ProductItem_productId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationCode" DROP CONSTRAINT "VerificationCode_userId_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToIngredient" DROP CONSTRAINT "_CartItemToIngredient_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToIngredient" DROP CONSTRAINT "_CartItemToIngredient_B_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToProduct" DROP CONSTRAINT "_IngredientToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_IngredientToProduct" DROP CONSTRAINT "_IngredientToProduct_B_fkey";

-- AlterTable
ALTER TABLE "CartItem" DROP COLUMN "productItemId",
ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" "Brand" NOT NULL,
ADD COLUMN     "concentration" "PerfumeConcentration" NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "gender" "Gender"[],
ADD COLUMN     "notes" "Notes"[],
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "releaseYear" INTEGER NOT NULL,
ADD COLUMN     "stoke" INTEGER NOT NULL,
ADD COLUMN     "types" "Types"[];

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "verified" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VerificationCode" ALTER COLUMN "userId" SET NOT NULL;

-- DropTable
DROP TABLE "Ingredient";

-- DropTable
DROP TABLE "ProductItem";

-- DropTable
DROP TABLE "_CartItemToIngredient";

-- DropTable
DROP TABLE "_IngredientToProduct";

-- CreateTable
CREATE TABLE "Story" (
    "id" SERIAL NOT NULL,
    "previewImageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryItem" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCode" ADD CONSTRAINT "VerificationCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryItem" ADD CONSTRAINT "StoryItem_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
