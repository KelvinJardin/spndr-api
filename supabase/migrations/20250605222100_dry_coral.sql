/*
  # Add Tax Category Mapping Table
  
  1. New Tables
    - `tax_category_mapping`
      - Links transaction categories to tax years with specific box mappings
      - Stores allowable status and notes per tax year
      - Ensures consistent tax treatment across years
  
  2. Changes
    - Remove tax-specific fields from transaction_category table
    - Add new linking table for tax year specific mappings
  
  3. Data Migration
    - Migrate existing tax box mappings to new table
*/

-- First remove the existing fields from TransactionCategory
ALTER TABLE "TransactionCategory" DROP COLUMN "sa103fBox",
                                 DROP COLUMN "allowable",
                                 DROP COLUMN "notes";

-- Create the new mapping table
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

-- Add indexes
CREATE INDEX "TaxCategoryMapping_categoryId_idx" ON "TaxCategoryMapping"("categoryId");
CREATE INDEX "TaxCategoryMapping_taxYearId_idx" ON "TaxCategoryMapping"("taxYearId");

-- Add unique constraint to prevent duplicate mappings
CREATE UNIQUE INDEX "TaxCategoryMapping_categoryId_taxYearId_key" ON "TaxCategoryMapping"("categoryId", "taxYearId");

-- Add foreign key constraints
ALTER TABLE "TaxCategoryMapping" ADD CONSTRAINT "TaxCategoryMapping_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "TransactionCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TaxCategoryMapping" ADD CONSTRAINT "TaxCategoryMapping_taxYearId_fkey"
    FOREIGN KEY ("taxYearId") REFERENCES "TaxYear"("id") ON DELETE CASCADE ON UPDATE CASCADE;