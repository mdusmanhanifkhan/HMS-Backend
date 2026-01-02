/*
  Warnings:

  - You are about to drop the column `createdByUserId` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_createdByUserId_fkey";

-- AlterTable
ALTER TABLE "public"."MedicalRecord" DROP COLUMN "createdByUserId";
