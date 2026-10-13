import { prisma } from "#server/utils/db";
import { CollectibleType } from "~~/prisma/generated/client.ts";
import { type CategoryWithCollectibles } from "#shared/catalog";
import { categorySelect, productSelect } from "#server/utils/catalog-select.ts";

const typeMapping: Record<string, CollectibleType> = {
	decorations: CollectibleType.AVATAR_DECORATION,
	effects: CollectibleType.PROFILE_EFFECT,
	nameplates: CollectibleType.NAMEPLATE,
	frames: CollectibleType.PROFILE_FRAME,
};

export default defineEventHandler(async (event): Promise<CategoryWithCollectibles[]> => {
	const query = getQuery(event);
	const typeParam = (query.type as string) || 'decorations';
	const collectibleType = typeMapping[typeParam] || CollectibleType.AVATAR_DECORATION;

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