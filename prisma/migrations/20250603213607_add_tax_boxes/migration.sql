/*
  Warnings:

  - You are about to drop the column `hmrcCategory` on the `TransactionCategory` table. All the data in the column will be lost.
  - Added the required column `sa103fBox` to the `TransactionCategory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Sa103fBox" AS ENUM ('BOX_8', 'BOX_9', 'BOX_17', 'BOX_18', 'BOX_19', 'BOX_20', 'BOX_21', 'BOX_22', 'BOX_23', 'BOX_24', 'BOX_25', 'BOX_26', 'BOX_27', 'BOX_30', 'BOX_31');

-- AlterTable
ALTER TABLE "TransactionCategory" DROP COLUMN "hmrcCategory",
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "sa103fBox" "Sa103fBox" NOT NULL,
ALTER COLUMN "allowable" SET DEFAULT true;

