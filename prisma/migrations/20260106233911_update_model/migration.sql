-- CreateTable
CREATE TABLE "public"."LabFee" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "departmentId" INTEGER NOT NULL,
    "procedureId" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalPrice" DECIMAL(10,2) NOT NULL,
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LabFee_departmentId_idx" ON "public"."LabFee"("departmentId");

-- CreateIndex
CREATE INDEX "LabFee_procedureId_idx" ON "public"."LabFee"("procedureId");

-- CreateIndex
CREATE UNIQUE INDEX "LabFee_procedureId_departmentId_key" ON "public"."LabFee"("procedureId", "departmentId");

-- AddForeignKey
ALTER TABLE "public"."LabFee" ADD CONSTRAINT "LabFee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabFee" ADD CONSTRAINT "LabFee_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "public"."Procedure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
