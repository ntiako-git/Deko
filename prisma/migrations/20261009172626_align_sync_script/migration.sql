/*
  Warnings:

  - The `palette` column on the `Nameplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "catalogBannerUrl" TEXT,
ADD COLUMN     "heroBannerUrl" TEXT,
ALTER COLUMN "logoUrl" DROP NOT NULL,
ALTER COLUMN "pdpBgUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Nameplate" DROP COLUMN "palette",
ADD COLUMN     "palette" TEXT NOT NULL DEFAULT 'none',
ALTER COLUMN "label" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProfileEffect" ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "accessibilityLabel" DROP NOT NULL;

-- DropEnum
DROP TYPE "NameplatePalette";
