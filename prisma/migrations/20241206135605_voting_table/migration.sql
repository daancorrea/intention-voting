-- CreateTable
CREATE TABLE "Voting" (
    "id" SERIAL NOT NULL,
    "searchId" TEXT NOT NULL,
    "searchDate" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "votingIntention" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Voting_city_idx" ON "Voting"("city");

-- CreateIndex
CREATE INDEX "Voting_searchId_idx" ON "Voting"("searchId");
