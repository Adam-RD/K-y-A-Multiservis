/*
  Warnings:

  - You are about to drop the column `brandId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_brandId_fkey";

-- DropIndex
DROP INDEX "Product_brandId_idx";

-- DropIndex
DROP INDEX "Product_sku_idx";

-- DropIndex
DROP INDEX "Product_sku_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "brandId",
DROP COLUMN "location",
DROP COLUMN "sku";

-- DropTable
DROP TABLE "Brand";
