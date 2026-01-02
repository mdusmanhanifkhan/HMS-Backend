/*
  Warnings:

  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_procedureId_fkey";

-- DropTable
DROP TABLE "public"."MedicalRecord";

-- CreateTable
CREATE TABLE "public"."MedicalRecords" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "procedureId" INTEGER NOT NULL,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fee" DECIMAL(10,2) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalFee" DECIMAL(10,2) NOT NULL,
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" INTEGER,

    CONSTRAINT "MedicalRecords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("patientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
