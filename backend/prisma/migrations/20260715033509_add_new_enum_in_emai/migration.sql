/*
  Warnings:

  - The values [PASSWORD_RESET] on the enum `OtpPurpose` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OtpPurpose_new" AS ENUM ('SIGNUP', 'LOGIN', 'RESET_PASSWORD', 'CHANGE_EMAIL', 'ORDER_CONFIRMATION');
ALTER TABLE "public"."EmailOTP" ALTER COLUMN "purpose" DROP DEFAULT;
ALTER TABLE "EmailOTP" ALTER COLUMN "purpose" TYPE "OtpPurpose_new" USING ("purpose"::text::"OtpPurpose_new");
ALTER TYPE "OtpPurpose" RENAME TO "OtpPurpose_old";
ALTER TYPE "OtpPurpose_new" RENAME TO "OtpPurpose";
DROP TYPE "public"."OtpPurpose_old";
ALTER TABLE "EmailOTP" ALTER COLUMN "purpose" SET DEFAULT 'SIGNUP';
COMMIT;
