import { prisma } from "#server/utils/db";
import { Prisma, CollectibleType } from "~~/prisma/generated/client";

const typeMapping: Record<string, CollectibleType> = {
	decorations: CollectibleType.AVATAR_DECORATION,
	effects: CollectibleType.PROFILE_EFFECT,
	nameplates: CollectibleType.NAMEPLATE,
	frames: CollectibleType.PROFILE_FRAME,
};

const categorySelect = {
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

export type CategoryWithCollectibles = Prisma.CategoryGetPayload<{
	select: typeof categorySelect & {
		products: {
			select: {
				id: true;
				name: true;
				priceEur: true;
				priceEurNitro: true,
				priceOrbs: true;
				type: true;
				avatarDecoration: { select: { asset: true; animated: true } };
				profileEffect: { select: { thumbnailPreviewSrc: true; } };
				nameplate: { select: { asset: true; } };
				profileFrame: {
					select: {
						skuId: true;
						layers: {
							select: {
								assetId: true;
								order: true;
								anchor: true;
							};
						};
					}
				};
			}
		}
	}
}>;

export default defineEventHandler(async (event): Promise<CategoryWithCollectibles[]> => {
	const query = getQuery(event);
	const typeParam = (query.type as string) || 'decorations';
	const collectibleType = typeMapping[typeParam] || CollectibleType.AVATAR_DECORATION;

	const productSelect = {
		id: true,
		name: true,
		priceEur: true,
		priceEurNitro: true,
		priceOrbs: true,
		type: true,
		avatarDecoration: { select: { asset: true, animated: true } },
		profileEffect: { select: { thumbnailPreviewSrc: true, } },
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

	const categories = await prisma.category.findMany({
		where: {
			products: { some: { type: collectibleType } }
		},
		select: {
			...categorySelect,
			products: {
				where: { type: collectibleType },
				orderBy: { name: "asc" },
				select: productSelect,
			},
		},
		orderBy: { name: 'asc' }
	});

	const uncategorizedProducts = await prisma.product.findMany({
		where: {
			type: collectibleType,
			categoryId: null
		},
		orderBy: { name: "asc" },
		select: productSelect,
	});

	const result = [...categories] as CategoryWithCollectibles[];

	if (uncategorizedProducts.length > 0)
		result.push({
			id: 'other-collectibles',
			storeListingId: 'other',
			name: 'Autres',
			summary: 'Objets sans collection spécifique',
			mobileSummary: null,
			bannerTextColor: null,
			logoUrl: null,
			heroLogoUrl: null,
			pdpBgUrl: null,
			mobileBannerUrl: null,
			mobileBgUrl: null,
			heroBannerUrl: null,
			catalogBannerUrl: null,
			backgroundColors: [],
			buttonColors: [],
			confettiColors: [],
			heroRanking: [],
			unpublishedAt: null,
			syncedAt: new Date(),
			products: uncategorizedProducts,
		});

	return result;
});