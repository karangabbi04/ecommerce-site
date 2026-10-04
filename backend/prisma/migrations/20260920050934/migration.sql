-- AlterTable
ALTER TABLE "CheckoutSession" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "couponId" TEXT,
ADD COLUMN     "discountAmount" DECIMAL(65,30) NOT NULL DEFAULT 0;
