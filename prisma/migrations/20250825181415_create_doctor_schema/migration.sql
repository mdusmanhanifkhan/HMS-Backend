/*
  Warnings:

  - You are about to drop the column `timeFrom` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `timeTo` on the `Department` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `shortCode` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `location` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `description` on the `Department` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to alter the column `name` on the `Procedure` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `shortCode` on the `Procedure` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(10)`.
  - You are about to alter the column `description` on the `Procedure` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - A unique constraint covering the columns `[departmentId,name]` on the table `Procedure` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'LOCUM');

-- CreateEnum
CREATE TYPE "public"."ShiftType" AS ENUM ('MORNING', 'EVENING', 'NIGHT', 'ROTATION');

-- CreateEnum
CREATE TYPE "public"."FeeType" AS ENUM ('FIXED', 'SHARE', 'SHARE_PLUS_FIXED');

-- DropForeignKey
ALTER TABLE "public"."Procedure" DROP CONSTRAINT "Procedure_departmentId_fkey";

-- DropIndex
DROP INDEX "public"."Procedure_name_key";

-- DropIndex
DROP INDEX "public"."Procedure_shortCode_key";

-- AlterTable
ALTER TABLE "public"."Department" DROP COLUMN "timeFrom",
DROP COLUMN "timeTo",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "shortCode" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "location" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "public"."Procedure" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "shortCode" DROP NOT NULL,
ALTER COLUMN "shortCode" SET DATA TYPE VARCHAR(10),
ALTER COLUMN "description" SET DATA TYPE VARCHAR(500);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(100) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "idCard" VARCHAR(20) NOT NULL,
    "phoneNumber" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255),
    "specialization" VARCHAR(100),
    "qualification" VARCHAR(100),
    "subSpecialities" VARCHAR(100),
    "experience" INTEGER NOT NULL,
    "languages" VARCHAR(100),
    "joinDate" TIMESTAMP(3) NOT NULL,
    "employmentType" "public"."EmploymentType" NOT NULL,
    "availableDays" VARCHAR(50),
    "timingFrom" VARCHAR(10),
    "timingTo" VARCHAR(10),
    "shiftType" "public"."ShiftType",
    "maxPatients" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoctorDepartment" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DoctorDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FeePolicy" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "public"."FeeType" NOT NULL,
    "fixedAmount" DECIMAL(10,2),
    "doctorPercentage" DECIMAL(5,2),
    "hospitalPercentage" DECIMAL(5,2),
    "validFrom" TIMESTAMP(3),
    "validTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DoctorProcedureFee" (
    "id" SERIAL NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "procedureId" INTEGER NOT NULL,
    "feePolicyId" INTEGER NOT NULL,
    "overrideFixedAmount" DECIMAL(10,2),
    "overrideDoctorPercentage" DECIMAL(5,2),
    "overrideHospitalPercentage" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorProcedureFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_idCard_key" ON "public"."Doctor"("idCard");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_phoneNumber_key" ON "public"."Doctor"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "public"."Doctor"("email");

-- CreateIndex
CREATE INDEX "Doctor_name_idx" ON "public"."Doctor"("name");

-- CreateIndex
CREATE INDEX "Doctor_specialization_idx" ON "public"."Doctor"("specialization");

-- CreateIndex
CREATE INDEX "DoctorDepartment_departmentId_idx" ON "public"."DoctorDepartment"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorDepartment_doctorId_departmentId_key" ON "public"."DoctorDepartment"("doctorId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "FeePolicy_name_key" ON "public"."FeePolicy"("name");

-- CreateIndex
CREATE INDEX "DoctorProcedureFee_feePolicyId_idx" ON "public"."DoctorProcedureFee"("feePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProcedureFee_doctorId_procedureId_key" ON "public"."DoctorProcedureFee"("doctorId", "procedureId");

-- CreateIndex
CREATE INDEX "Department_name_idx" ON "public"."Department"("name");

-- CreateIndex
CREATE INDEX "Procedure_departmentId_idx" ON "public"."Procedure"("departmentId");

-- CreateIndex
CREATE INDEX "Procedure_name_idx" ON "public"."Procedure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_departmentId_name_key" ON "public"."Procedure"("departmentId", "name");

-- AddForeignKey
ALTER TABLE "public"."Procedure" ADD CONSTRAINT "Procedure_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorDepartment" ADD CONSTRAINT "DoctorDepartment_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorDepartment" ADD CONSTRAINT "DoctorDepartment_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorProcedureFee" ADD CONSTRAINT "DoctorProcedureFee_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorProcedureFee" ADD CONSTRAINT "DoctorProcedureFee_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DoctorProcedureFee" ADD CONSTRAINT "DoctorProcedureFee_feePolicyId_fkey" FOREIGN KEY ("feePolicyId") REFERENCES "public"."FeePolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
