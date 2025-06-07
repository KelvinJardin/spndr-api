-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_31';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_33';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_34';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_35';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_36';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_37';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_38';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_39';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_40';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_41';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_42';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_43';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_44';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_45';
ALTER TYPE "Sa103fBox" ADD VALUE 'BOX_46';

-- AlterTable
ALTER TABLE "TaxCategoryMapping" ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
