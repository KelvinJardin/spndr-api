/*
  # Update transaction categories and tax mappings

  1. Changes
    - Updates transaction categories to match new list
    - Adds tax box mappings for each category
    - Ensures proper tax treatment for each category

  2. Categories Added
    - Income categories:
      - Sales (Box 15)
      - Other business income (Box 16)
    - Expense categories:
      - Cost of goods for resale (Box 17)
      - Construction subcontractors (Box 18)
      - Wages, salaries and other staff costs (Box 19)
      - Car / Van / Travel expenses (Box 20)
      - Rent / Utilities / Insurance (Box 21)
      - Property / Equipment Repairs (Box 22)
      - Office supplies (Box 23)
      - Advertising / Business entertainment (Box 24)
      - Bank interest / Loans (Box 25)
      - Financial charges (Box 26)
      - Bad debts (Box 27)
      - Accountancy / Legal / Other professional fees (Box 28)
      - Asset Depreciation (Box 29)
      - Other business expenses (Box 30)
      - Disallowable expenses (Box 32-45)
*/

-- Update Sa103fBox enum to include new boxes
ALTER TYPE "Sa103fBox" ADD VALUE IF NOT EXISTS 'BOX_15';
ALTER TYPE "Sa103fBox" ADD VALUE IF NOT EXISTS 'BOX_16';
ALTER TYPE "Sa103fBox" ADD VALUE IF NOT EXISTS 'BOX_28';
ALTER TYPE "Sa103fBox" ADD VALUE IF NOT EXISTS 'BOX_29';
ALTER TYPE "Sa103fBox" ADD VALUE IF NOT EXISTS 'BOX_32';

-- Clean up existing data
TRUNCATE TABLE "TaxCategoryMapping" CASCADE;
TRUNCATE TABLE "TransactionCategory" CASCADE;