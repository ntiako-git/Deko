export interface CategoryWithCollectibles {
	id: string;
	storeListingId: string;
	name: string;
	summary: string;
	mobileSummary: string | null;
	bannerTextColor: string | null;
	logoUrl: string | null;
	heroLogoUrl: string | null;
	pdpBgUrl: string | null;
	mobileBannerUrl: string | null;
	mobileBgUrl: string | null;
	heroBannerUrl: string | null;
	catalogBannerUrl: string | null;
	backgroundColors: number[];
	buttonColors: number[];
	confettiColors: number[];
	heroRanking: string[];
	unpublishedAt: Date | null;
	syncedAt: Date;
	products: CatalogProduct[];
}

type CatalogProductType =
	| "AVATAR_DECORATION"
	| "PROFILE_EFFECT"
	| "NAMEPLATE"
	| "PROFILE_FRAME"
	| "BUNDLE"
	| "VARIANTS_GROUP"
	| "EXTERNAL_SKU";

interface CatalogProduct {
	id: string;
	name: string;
	priceEur: number | null;
	priceEurNitro: number | null;
	priceOrbs: number | null;
	type: CatalogProductType;
	previewFgStatic: string | null;
	avatarDecoration: {
		asset: string;
		animated: boolean;
	} | null;
	profileEffect: {
		thumbnailPreviewSrc: string | null;
	} | null;
	nameplate: {
		asset: string;
	} | null;
	profileFrame: {
		skuId: string;
		layers: {
			assetId: string;
			order: string;
			anchor: string;
		}[];
	} | null;
}