-- DropForeignKey
ALTER TABLE "public"."WelfarePatient" DROP CONSTRAINT "WelfarePatient_patientId_fkey";

-- AddForeignKey
ALTER TABLE "public"."WelfarePatient" ADD CONSTRAINT "WelfarePatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("patientId") ON DELETE CASCADE ON UPDATE CASCADE;
