-- AlterTable
ALTER TABLE "CheckoutSession" ADD COLUMN     "guestId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
