-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "globalName" TEXT,
    "avatar" TEXT,
    "locale" TEXT,
    "nitro" BOOLEAN NOT NULL DEFAULT false,
    "avatarDecorationSkuId" TEXT,
    "avatarDecorationAsset" TEXT,
    "nameplateSkuId" TEXT,
    "nameplateAsset" TEXT,
    "nameplateLabel" TEXT,
    "nameplatePalette" TEXT,
    "profileEffectSkuId" TEXT,
    "profileFrameSkuId" TEXT,
    "onboardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
