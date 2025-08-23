-- CreateTable
CREATE TABLE "public"."Procedure" (
    "id" SERIAL NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "name" TEXT NOT NULL,
    "shortCode" TEXT NOT NULL,
    "description" TEXT,
    "departmentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Procedure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_name_key" ON "public"."Procedure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Procedure_shortCode_key" ON "public"."Procedure"("shortCode");

-- AddForeignKey
ALTER TABLE "public"."Procedure" ADD CONSTRAINT "Procedure_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "public"."Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
