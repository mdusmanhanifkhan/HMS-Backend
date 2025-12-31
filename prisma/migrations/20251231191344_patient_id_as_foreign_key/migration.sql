-- DropForeignKey
ALTER TABLE "public"."MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("patientId") ON DELETE CASCADE ON UPDATE CASCADE;
