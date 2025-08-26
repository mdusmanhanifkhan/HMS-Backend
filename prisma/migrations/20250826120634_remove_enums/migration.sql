/*
  Warnings:

  - The `employmentType` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `shiftType` column on the `Doctor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `type` column on the `FeePolicy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Doctor" DROP COLUMN "employmentType",
ADD COLUMN     "employmentType" TEXT,
DROP COLUMN "shiftType",
ADD COLUMN     "shiftType" TEXT,
ALTER COLUMN "gender" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."FeePolicy" DROP COLUMN "type",
ADD COLUMN     "type" TEXT;

-- DropEnum
DROP TYPE "public"."EmploymentType";

-- DropEnum
DROP TYPE "public"."FeeType";

-- DropEnum
DROP TYPE "public"."ShiftType";
