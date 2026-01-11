/*
  Warnings:

  - You are about to drop the column `fee` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_procedureId_fkey";

-- AlterTable
ALTER TABLE "public"."MedicalRecord" DROP COLUMN "fee",
DROP COLUMN "visitDate",
ADD COLUMN     "recordDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "departmentId" DROP NOT NULL,
ALTER COLUMN "procedureId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."MedicalRecordItem" (
    "id" SERIAL NOT NULL,
    "medicalRecordId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "doctorId" INTEGER,
    "procedureId" INTEGER NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalFee" DECIMAL(10,2) NOT NULL,
    "notes" VARCHAR(500),

    CONSTRAINT "MedicalRecordItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedicalRecordItem_medicalRecordId_idx" ON "public"."MedicalRecordItem"("medicalRecordId");

-- CreateIndex
CREATE INDEX "MedicalRecordItem_departmentId_idx" ON "public"."MedicalRecordItem"("departmentId");

-- CreateIndex
CREATE INDEX "MedicalRecordItem_doctorId_idx" ON "public"."MedicalRecordItem"("doctorId");

-- CreateIndex
CREATE INDEX "MedicalRecord_patientId_idx" ON "public"."MedicalRecord"("patientId");

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecordItem" ADD CONSTRAINT "MedicalRecordItem_medicalRecordId_fkey" FOREIGN KEY ("medicalRecordId") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecordItem" ADD CONSTRAINT "MedicalRecordItem_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecordItem" ADD CONSTRAINT "MedicalRecordItem_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecordItem" ADD CONSTRAINT "MedicalRecordItem_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
