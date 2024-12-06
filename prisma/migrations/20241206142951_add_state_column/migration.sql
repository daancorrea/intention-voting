/*
  Warnings:

  - Added the required column `state` to the `Voting` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `searchDate` on the `Voting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Voting" ADD COLUMN     "state" TEXT NOT NULL,
DROP COLUMN "searchDate",
ADD COLUMN     "searchDate" TIMESTAMP(3) NOT NULL;
