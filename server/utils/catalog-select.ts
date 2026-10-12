import type { Prisma } from "~~/prisma/generated/client.ts";

export const categorySelect = {
	id: true,
	storeListingId: true,
	name: true,
	summary: true,
	mobileSummary: true,
	bannerTextColor: true,
	logoUrl: true,
	heroLogoUrl: true,
	pdpBgUrl: true,
	mobileBannerUrl: true,
	mobileBgUrl: true,
	heroBannerUrl: true,
	catalogBannerUrl: true,
	backgroundColors: true,
	buttonColors: true,
	confettiColors: true,
	heroRanking: true,
	unpublishedAt: true,
	syncedAt: true,
} satisfies Prisma.CategorySelect;

export const productSelect = {
	id: true,
	name: true,
	priceEur: true,
	priceEurNitro: true,
	priceOrbs: true,
	type: true,
	previewFgStatic: true,
	avatarDecoration: { select: { asset: true, animated: true } },
	profileEffect: { select: { thumbnailPreviewSrc: true } },
	nameplate: { select: { asset: true } },
	profileFrame: {
		select: {
			skuId: true,
			layers: {
				where: { type: { not: 'rail' } },
				select: {
					assetId: true,
					order: true,
					anchor: true,
				},
			},
		},
	},
} satisfies Prisma.ProductSelect;