-- CreateEnum
CREATE TYPE "CheckoutStatus" AS ENUM ('ACTIVE', 'PAYMENT_PENDING', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "CheckoutSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "CheckoutStatus" NOT NULL DEFAULT 'ACTIVE',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "shipping" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "tax" DECIMAL(10,2) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckoutSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutItem" (
    "id" TEXT NOT NULL,
    "checkoutSessionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckoutItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckoutSession_userId_idx" ON "CheckoutSession"("userId");

-- CreateIndex
CREATE INDEX "CheckoutItem_checkoutSessionId_idx" ON "CheckoutItem"("checkoutSessionId");

-- AddForeignKey
ALTER TABLE "CheckoutItem" ADD CONSTRAINT "CheckoutItem_checkoutSessionId_fkey" FOREIGN KEY ("checkoutSessionId") REFERENCES "CheckoutSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
