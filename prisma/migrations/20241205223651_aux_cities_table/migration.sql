-- CreateTable
CREATE TABLE "AuxCities" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "lastChecked" TEXT NOT NULL,

    CONSTRAINT "AuxCities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AuxCities_fileName_idx" ON "AuxCities"("fileName");
