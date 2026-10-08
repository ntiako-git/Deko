/*
  Warnings:

  - Made the column `logoUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pdpBgUrl` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Made the column `label` on table `Nameplate` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `ProfileEffect` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accessibilityLabel` on table `ProfileEffect` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "logoUrl" SET NOT NULL,
ALTER COLUMN "pdpBgUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Nameplate" ALTER COLUMN "label" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProfileEffect" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "accessibilityLabel" SET NOT NULL;
