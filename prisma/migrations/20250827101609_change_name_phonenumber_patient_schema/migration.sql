/*
  Warnings:

  - You are about to drop the column `number` on the `Patient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Patient_number_key";

-- AlterTable
ALTER TABLE "public"."Patient" DROP COLUMN "number",
ADD COLUMN     "phoneNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_phoneNumber_key" ON "public"."Patient"("phoneNumber");
