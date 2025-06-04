/*
  # Add bank accounts
  
  1. New Tables
    - `BankAccount`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `accountNumber` (text, required)
      - `sortCode` (text, required)
      - `userId` (uuid, foreign key to User)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Changes
    - Add optional `bankAccountId` to Transaction table
    - Add index on `bankAccountId` for better query performance
    - Add foreign key constraint to ensure referential integrity

  3. Security
    - Enable RLS on `BankAccount` table
    - Add policy for authenticated users to manage their own bank accounts
*/

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "sortCode" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- Add bank account reference to transactions
ALTER TABLE "Transaction"
ADD COLUMN "bankAccountId" TEXT;

-- Create indexes
CREATE INDEX "BankAccount_userId_idx" ON "BankAccount"("userId");
CREATE INDEX "Transaction_bankAccountId_idx" ON "Transaction"("bankAccountId");

-- Add foreign key constraints
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bankAccountId_fkey"
    FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "BankAccount" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own bank accounts"
    ON "BankAccount"
    FOR ALL
    TO authenticated
    USING (auth.uid() = "userId");