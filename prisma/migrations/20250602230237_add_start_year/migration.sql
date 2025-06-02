/*
  Warnings:

  - Added the required column `startYear` to the `TaxYear` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TaxYear" ADD COLUMN     "startYear" INTEGER NOT NULL;
