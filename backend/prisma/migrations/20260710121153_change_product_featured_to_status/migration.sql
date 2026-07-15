/*
  Warnings:

  - You are about to drop the column `isFeatured` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isFeatured",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
