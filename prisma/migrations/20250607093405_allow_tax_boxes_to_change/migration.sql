/*
  Warnings:

  - The values [BOX_8,BOX_9,BOX_31] on the enum `Sa103fBox` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Sa103fBox_new" AS ENUM ('BOX_15', 'BOX_16', 'BOX_17', 'BOX_18', 'BOX_19', 'BOX_20', 'BOX_21', 'BOX_22', 'BOX_23', 'BOX_24', 'BOX_25', 'BOX_26', 'BOX_27', 'BOX_28', 'BOX_29', 'BOX_30', 'BOX_32');
ALTER TABLE "TaxCategoryMapping" ALTER COLUMN "sa103fBox" TYPE "Sa103fBox_new" USING ("sa103fBox"::text::"Sa103fBox_new");
ALTER TYPE "Sa103fBox" RENAME TO "Sa103fBox_old";
ALTER TYPE "Sa103fBox_new" RENAME TO "Sa103fBox";
DROP TYPE "Sa103fBox_old";
COMMIT;
