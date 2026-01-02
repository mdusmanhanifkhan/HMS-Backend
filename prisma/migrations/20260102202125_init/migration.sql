-- CreateTable
CREATE TABLE "public"."Department" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "shortCode" VARCHAR(10),
    "location" VARCHAR(100),
    "description" VARCHAR(500),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "timeFrom" TEXT,
    "timeTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Procedure" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(100) NOT NULL,
    "shortCode" VARCHAR(10),
    "description" VARCHAR(500),
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR(100) NOT NULL,
    "guardianName" VARCHAR(100),
    "gender" TEXT,
    "dateOfBirth" TEXT,
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
    "joinDate" TEXT,
    "employmentType" TEXT,
    "shiftType" TEXT,
    "timingFrom" VARCHAR(10),
    "timingTo" VARCHAR(10),
    "availableDays" VARCHAR(100)[],
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
    "type" TEXT,
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
    "feePolicyId" INTEGER,
    "departmentId" INTEGER,
    "paymentType" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "procedurePrice" DECIMAL(10,2),
    "overrideFixedAmount" DECIMAL(10,2),
    "overrideDoctorPercentage" DECIMAL(5,2),
    "overrideHospitalPercentage" DECIMAL(5,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DoctorProcedureFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Patient" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "guardianName" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "cnicNumber" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "doctorId" INTEGER NOT NULL,
    "procedureId" INTEGER NOT NULL,
    "createdByUserId" INTEGER,
    "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fee" DECIMAL(10,2) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalFee" DECIMAL(10,2) NOT NULL,
    "notes" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "canManageDepartments" BOOLEAN NOT NULL DEFAULT false,
    "canManageDoctors" BOOLEAN NOT NULL DEFAULT false,
    "canManagePatients" BOOLEAN NOT NULL DEFAULT false,
    "canManageWelfare" BOOLEAN NOT NULL DEFAULT false,
    "canManageProcedures" BOOLEAN NOT NULL DEFAULT false,
    "canManageFees" BOOLEAN NOT NULL DEFAULT false,
    "canViewReports" BOOLEAN NOT NULL DEFAULT false,
    "canManagePatientsHistory" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "public"."Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_shortCode_key" ON "public"."Department"("shortCode");

-- CreateIndex
CREATE INDEX "Department_name_idx" ON "public"."Department"("name");

-- CreateIndex
CREATE INDEX "Procedure_departmentId_idx" ON "public"."Procedure"("departmentId");

-- CreateIndex
CREATE INDEX "Procedure_name_idx" ON "public"."Procedure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_departmentId_name_key" ON "public"."Procedure"("departmentId", "name");

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
CREATE INDEX "DoctorProcedureFee_departmentId_idx" ON "public"."DoctorProcedureFee"("departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "DoctorProcedureFee_doctorId_procedureId_key" ON "public"."DoctorProcedureFee"("doctorId", "procedureId");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_patientId_key" ON "public"."Patient"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "WelfarePatient_patientId_key" ON "public"."WelfarePatient"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "public"."Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

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

-- AddForeignKey
ALTER TABLE "public"."DoctorProcedureFee" ADD CONSTRAINT "DoctorProcedureFee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WelfarePatient" ADD CONSTRAINT "WelfarePatient_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."Patient"("patientId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "public"."Doctor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
