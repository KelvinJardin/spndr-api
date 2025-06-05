/*
  Warnings:

  - You are about to drop the column `allowable` on the `TransactionCategory` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `TransactionCategory` table. All the data in the column will be lost.
  - You are about to drop the column `sa103fBox` on the `TransactionCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TransactionCategory" DROP COLUMN "allowable",
DROP COLUMN "notes",
DROP COLUMN "sa103fBox";

-- CreateTable
CREATE TABLE "TaxCategoryMapping" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "taxYearId" TEXT NOT NULL,
    "sa103fBox" "Sa103fBox" NOT NULL,
    "allowable" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxCategoryMapping_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxCategoryMapping_categoryId_idx" ON "TaxCategoryMapping"("categoryId");

-- CreateIndex
CREATE INDEX "TaxCategoryMapping_taxYearId_idx" ON "TaxCategoryMapping"("taxYearId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxCategoryMapping_categoryId_taxYearId_key" ON "TaxCategoryMapping"("categoryId", "taxYearId");

-- AddForeignKey
ALTER TABLE "TaxCategoryMapping" ADD CONSTRAINT "TaxCategoryMapping_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TransactionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCategoryMapping" ADD CONSTRAINT "TaxCategoryMapping_taxYearId_fkey" FOREIGN KEY ("taxYearId") REFERENCES "TaxYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;
