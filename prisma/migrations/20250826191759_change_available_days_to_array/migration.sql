/*
  Warnings:

  - The `availableDays` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "availableDays",
ADD COLUMN     "availableDays" VARCHAR(100)[];
