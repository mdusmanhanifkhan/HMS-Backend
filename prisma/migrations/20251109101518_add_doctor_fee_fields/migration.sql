/*
  Warnings:

  - Added the required column `paymentType` to the `DoctorProcedureFee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DoctorProcedureFee" ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "description" VARCHAR(500),
ADD COLUMN     "paymentType" VARCHAR(50) NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "feePolicyId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "DoctorProcedureFee_departmentId_idx" ON "public"."DoctorProcedureFee"("departmentId");

-- AddForeignKey
ALTER TABLE "public"."DoctorProcedureFee" ADD CONSTRAINT "DoctorProcedureFee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
