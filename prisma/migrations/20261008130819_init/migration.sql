-- CreateEnum
CREATE TYPE "CollectibleType" AS ENUM ('AVATAR_DECORATION', 'PROFILE_EFFECT', 'NAMEPLATE', 'PROFILE_FRAME', 'BUNDLE', 'VARIANTS_GROUP', 'EXTERNAL_SKU');

-- CreateEnum
CREATE TYPE "EffectAnimationType" AS ENUM ('UNSPECIFIED', 'PERSISTENT', 'INTERMITTENT');

-- CreateEnum
CREATE TYPE "NameplatePalette" AS ENUM ('none', 'crimson', 'berry', 'sky', 'teal', 'forest', 'bubble_gum', 'violet', 'cobalt', 'clover', 'lemon', 'white');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "storeListingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "mobileSummary" TEXT,
    "bannerTextColor" TEXT,
    "logoUrl" TEXT,
    "heroLogoUrl" TEXT,
    "pdpBgUrl" TEXT,
    "mobileBannerUrl" TEXT,
    "mobileBgUrl" TEXT,
    "backgroundColors" INTEGER[],
    "buttonColors" INTEGER[],
    "confettiColors" INTEGER[],
    "heroRanking" TEXT[],
    "unpublishedAt" TIMESTAMP(3),
    "raw" JSONB,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "storeListingId" TEXT,
    "type" "CollectibleType" NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "premiumType" INTEGER NOT NULL DEFAULT 0,
    "unpublishedAt" TIMESTAMP(3),
    "categoryId" TEXT,
    "backgroundColors" INTEGER[],
    "buttonColors" INTEGER[],
    "confettiColors" INTEGER[],
    "previewFgStatic" TEXT,
    "previewFgAnimated" TEXT,
    "previewBgStatic" TEXT,
    "previewBgAnimated" TEXT,
    "raw" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BundleItem" (
    "bundleId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BundleItem_pkey" PRIMARY KEY ("bundleId","itemId")
);

-- CreateTable
CREATE TABLE "AvatarDecoration" (
    "skuId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "animated" BOOLEAN NOT NULL DEFAULT false,
    "label" TEXT,

    CONSTRAINT "AvatarDecoration_pkey" PRIMARY KEY ("skuId")
);

-- CreateTable
CREATE TABLE "ProfileEffect" (
    "skuId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "accessibilityLabel" TEXT,
    "animationType" "EffectAnimationType" NOT NULL DEFAULT 'UNSPECIFIED',
    "thumbnailPreviewSrc" TEXT NOT NULL,
    "reducedMotionSrc" TEXT NOT NULL,
    "staticFrameSrc" TEXT,

    CONSTRAINT "ProfileEffect_pkey" PRIMARY KEY ("skuId")
);

-- CreateTable
CREATE TABLE "ProfileEffectLayer" (
    "id" SERIAL NOT NULL,
    "effectId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "src" TEXT NOT NULL,
    "loop" BOOLEAN NOT NULL DEFAULT false,
    "duration" INTEGER NOT NULL,
    "start" INTEGER NOT NULL DEFAULT 0,
    "loopDelay" INTEGER NOT NULL DEFAULT 0,
    "zIndex" INTEGER NOT NULL DEFAULT 0,
    "width" INTEGER,
    "height" INTEGER,
    "posX" INTEGER,
    "posY" INTEGER,
    "randomizedSources" TEXT[],

    CONSTRAINT "ProfileEffectLayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nameplate" (
    "skuId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "palette" "NameplatePalette" NOT NULL DEFAULT 'none',
    "label" TEXT,

    CONSTRAINT "Nameplate_pkey" PRIMARY KEY ("skuId")
);

-- CreateTable
CREATE TABLE "ProfileFrame" (
    "skuId" TEXT NOT NULL,
    "label" TEXT,
    "innerWidth" INTEGER NOT NULL,
    "overflowTop" INTEGER NOT NULL,
    "overflowBottom" INTEGER NOT NULL,
    "overflowHorizontal" INTEGER NOT NULL,

    CONSTRAINT "ProfileFrame_pkey" PRIMARY KEY ("skuId")
);

-- CreateTable
CREATE TABLE "ProfileFrameLayer" (
    "id" SERIAL NOT NULL,
    "frameId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "assetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "order" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "responsive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfileFrameLayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");

-- CreateIndex
CREATE INDEX "BundleItem_itemId_idx" ON "BundleItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileEffectLayer_effectId_position_key" ON "ProfileEffectLayer"("effectId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileFrameLayer_frameId_position_key" ON "ProfileFrameLayer"("frameId", "position");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_bundleId_fkey" FOREIGN KEY ("bundleId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BundleItem" ADD CONSTRAINT "BundleItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AvatarDecoration" ADD CONSTRAINT "AvatarDecoration_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEffect" ADD CONSTRAINT "ProfileEffect_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileEffectLayer" ADD CONSTRAINT "ProfileEffectLayer_effectId_fkey" FOREIGN KEY ("effectId") REFERENCES "ProfileEffect"("skuId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nameplate" ADD CONSTRAINT "Nameplate_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileFrame" ADD CONSTRAINT "ProfileFrame_skuId_fkey" FOREIGN KEY ("skuId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileFrameLayer" ADD CONSTRAINT "ProfileFrameLayer_frameId_fkey" FOREIGN KEY ("frameId") REFERENCES "ProfileFrame"("skuId") ON DELETE CASCADE ON UPDATE CASCADE;
