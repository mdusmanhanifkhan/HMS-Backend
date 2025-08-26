/*
  Warnings:

  - Added the required column `dateOfBirth` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guardianName` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" ADD COLUMN     "dateOfBirth" TEXT NOT NULL,
ADD COLUMN     "guardianName" VARCHAR(100) NOT NULL,
ALTER COLUMN "availableDays" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "gender" SET NOT NULL;
