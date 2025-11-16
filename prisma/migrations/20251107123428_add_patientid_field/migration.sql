/*
  Warnings:

  - A unique constraint covering the columns `[patientId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `patientId` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "patientId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "public"."Patient"("patientId");
