/*
  # Update transaction categories for SA103F

  1. Changes
    - Update transaction categories to match HMRC SA103F form sections
    - Add SA103F box numbers for automatic tax return mapping
    - Update existing categories with new HMRC mappings

  2. New Fields
    - Add sa103fBox field to store the corresponding box number on the SA103F form
*/

-- First, remove existing categories
DELETE FROM "TransactionCategory";

-- Add sa103fBox column
ALTER TABLE "TransactionCategory" ADD COLUMN "sa103fBox" TEXT;

-- Income Categories (Box 8 to Box 11)
INSERT INTO "TransactionCategory" ("id", "name", "description", "type", "allowable", "hmrcCategory", "sa103fBox", "createdAt", "updatedAt") VALUES
  -- Box 8: Turnover
  (gen_random_uuid(), 'Turnover', 'Total business income (turnover)', 'INCOME', false, 'TURNOVER', '8', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Box 9: Other business income
  (gen_random_uuid(), 'Other Income', 'Any other business income', 'INCOME', false, 'OTHER_INCOME', '9', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Expense Categories (Box 17 to Box 31)
INSERT INTO "TransactionCategory" ("id", "name", "description", "type", "allowable", "hmrcCategory", "sa103fBox", "createdAt", "updatedAt") VALUES
  -- Costs of goods bought for resale or goods used
  (gen_random_uuid(), 'Cost of Goods', 'Cost of goods bought for resale', 'EXPENSE', true, 'COST_OF_GOODS', '17', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Car, van and travel expenses
  (gen_random_uuid(), 'Travel Expenses', 'Car, van and travel expenses', 'EXPENSE', true, 'TRAVEL', '18', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Wages, salaries and other staff costs
  (gen_random_uuid(), 'Staff Costs', 'Wages, salaries and other staff costs', 'EXPENSE', true, 'STAFF_COSTS', '19', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Rent, rates, power and insurance costs
  (gen_random_uuid(), 'Premises Costs', 'Rent, rates, power and insurance costs', 'EXPENSE', true, 'PREMISES', '20', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Repairs and renewals of property and equipment
  (gen_random_uuid(), 'Repairs and Maintenance', 'Repairs and maintenance', 'EXPENSE', true, 'REPAIRS', '21', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Accountancy, legal and other professional fees
  (gen_random_uuid(), 'Professional Fees', 'Accountancy, legal and other professional fees', 'EXPENSE', true, 'PROFESSIONAL_FEES', '22', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Interest and bank and credit card financial charges
  (gen_random_uuid(), 'Financial Charges', 'Bank, credit card and other financial charges', 'EXPENSE', true, 'FINANCIAL_CHARGES', '23', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Phone, fax, stationery and other office costs
  (gen_random_uuid(), 'Office Costs', 'Phone, fax, stationery and other office costs', 'EXPENSE', true, 'OFFICE_COSTS', '24', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Other allowable business expenses
  (gen_random_uuid(), 'Other Expenses', 'Other allowable business expenses', 'EXPENSE', true, 'OTHER_EXPENSES', '25', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  -- Non-allowable expenses
  (gen_random_uuid(), 'Non-allowable Expenses', 'Expenses not allowable for tax purposes', 'EXPENSE', false, 'NON_ALLOWABLE', '31', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);