/*
  Warnings:

  - Made the column `cnicNumber` on table `Patient` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."Patient_cnicNumber_key";

-- DropIndex
DROP INDEX "public"."Patient_phoneNumber_key";

-- AlterTable
ALTER TABLE "public"."Patient" ALTER COLUMN "cnicNumber" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;
