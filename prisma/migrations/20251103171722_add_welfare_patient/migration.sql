-- CreateTable
CREATE TABLE "public"."WelfarePatient" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "welfareCategory" VARCHAR(100) NOT NULL,
    "discountType" VARCHAR(50),
    "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "approvedBy" VARCHAR(100),
    "referredBy" VARCHAR(100),
    "remarks" VARCHAR(500),
    "monthlyIncome" VARCHAR(100),
    "sourceOfIncome" VARCHAR(100),
    "houseOwnership" VARCHAR(100),
    "houseType" VARCHAR(100),
    "vehicleOwnership" VARCHAR(100),
    "familyMembers" INTEGER,
    "workingMembers" INTEGER,
    "educationLevel" VARCHAR(100),
    "financialRemarks" VARCHAR(500),
    "verificationStatus" VARCHAR(50),
    "verifiedBy" VARCHAR(100),
    "verificationDate" TIMESTAMP(3),
    "approvalDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WelfarePatient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WelfarePatient_patientId_key" ON "public"."WelfarePatient"("patientId");

-- AddForeignKey
ALTER TABLE "public"."WelfarePatient" ADD CONSTRAINT "WelfarePatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
