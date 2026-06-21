/*
  Warnings:

  - You are about to drop the column `addressLine2` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "addressLine2",
ADD COLUMN     "landmark" TEXT;
