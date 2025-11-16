/*
  Warnings:

  - A unique constraint covering the columns `[cnicNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[number]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "number" DROP NOT NULL,
ALTER COLUMN "cnicNumber" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_cnicNumber_key" ON "public"."Patient"("cnicNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_number_key" ON "public"."Patient"("number");
