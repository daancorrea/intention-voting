-- CreateTable
CREATE TABLE "IntentionResult" (
    "id" SERIAL NOT NULL,
    "searchId" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "statePopulation" INTEGER NOT NULL,
    "percentVoting" INTEGER NOT NULL,
    "candidateAhead" TEXT NOT NULL,

    CONSTRAINT "IntentionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IntentionResult_searchId_state_idx" ON "IntentionResult"("searchId", "state");
