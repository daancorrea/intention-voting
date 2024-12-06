-- CreateTable
CREATE TABLE "Population" (
    "id" SERIAL NOT NULL,
    "state" TEXT NOT NULL,
    "stateCode" INTEGER NOT NULL,
    "cityCode" INTEGER NOT NULL,
    "cityName" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Population_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Population_cityName_state_idx" ON "Population"("cityName", "state");

-- CreateIndex
CREATE INDEX "Population_year_idx" ON "Population"("year");
