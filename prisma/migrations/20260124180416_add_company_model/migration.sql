/*
  Warnings:

  - Added the required column `userId` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."MedicalRecord" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Role" ADD COLUMN     "canManageFinanceReport" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canManageToken" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "contactPerson" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "drugRegistrationNo" TEXT,
    "manufacturingLicenseNo" TEXT,
    "ntnNumber" TEXT,
    "gstNumber" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
