-- AlterTable
ALTER TABLE "public"."Patient" ADD COLUMN     "createdByUserId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Patient" ADD CONSTRAINT "Patient_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
