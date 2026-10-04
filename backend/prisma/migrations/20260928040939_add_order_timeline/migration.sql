/*
  Warnings:

  - The values [PROCESSING] on the enum `OrderStatus` will be removed.
    If these variants are still used in the database, this will fail.
*/

-- AlterEnum
BEGIN;

CREATE TYPE "OrderStatus_new" AS ENUM (
  'PENDING',
  'CONFIRMED',
  'PACKED',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED'
);

ALTER TABLE "Order"
ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Order"
ALTER COLUMN "status"
TYPE "OrderStatus_new"
USING ("status"::text::"OrderStatus_new");

ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";

ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";

DROP TYPE "OrderStatus_old";

ALTER TABLE "Order"
ALTER COLUMN "status" SET DEFAULT 'PENDING';

COMMIT;

-- Add currentStatus
ALTER TABLE "Order"
ADD COLUMN "currentStatus" "OrderStatus"
NOT NULL DEFAULT 'PENDING';

-- Create OrderTimeline
CREATE TABLE "OrderTimeline" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "note" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderTimeline_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE INDEX "OrderTimeline_orderId_idx"
ON "OrderTimeline"("orderId");

CREATE INDEX "Order_currentStatus_idx"
ON "Order"("currentStatus");

-- Create foreign key
ALTER TABLE "OrderTimeline"
ADD CONSTRAINT "OrderTimeline_orderId_fkey"
FOREIGN KEY ("orderId")
REFERENCES "Order"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;