/*
  Warnings:

  - You are about to drop the column `cityCode` on the `Population` table. All the data in the column will be lost.
  - You are about to drop the column `stateCode` on the `Population` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Population" DROP COLUMN "cityCode",
DROP COLUMN "stateCode";
