-- AlterEnum
ALTER TYPE "OtpPurpose" ADD VALUE 'ORDER_CONFIRMATION';

-- AlterTable
ALTER TABLE "EmailOTP" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "varifiedAt" TIMESTAMP(3),
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
