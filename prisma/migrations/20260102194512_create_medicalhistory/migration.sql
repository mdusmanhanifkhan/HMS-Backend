/*
  Warnings:

  - You are about to drop the `MedicalRecords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_createdByUserId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_doctorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_patientId_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_procedureId_fkey";

-- DropTable
DROP TABLE "public"."MedicalRecords";

-- CreateTable
CREATE TABLE "public"."MedicalHistory" (
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

    CONSTRAINT "MedicalHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("patientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalHistory" ADD CONSTRAINT "MedicalHistory_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
