import { prisma } from "#server/utils/db";
import { type CategoryWithCollectibles } from "#shared/catalog";
import { productSelect } from "#server/utils/catalog-select.ts";

export default defineEventHandler(async (event): Promise<CategoryWithCollectibles> => {
	const id = getRouterParam(event, 'id');

	// Gérer la collection "Autres" (produits sans catégorie)
	if (id === 'other-collectibles') {
		const products = await prisma.product.findMany({
			where: { categoryId: null },
			orderBy: { name: 'asc' },
			select: productSelect,
		});

		return {
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
			products,
		} as CategoryWithCollectibles;
	}

	// Récupérer une catégorie classique
	const category = await prisma.category.findUnique({
		where: { id },
		include: {
			products: {
				orderBy: { name: 'asc' },
				select: productSelect,
			}
		}
	});

	if (!category)
		throw createError({
			statusCode: 404,
			statusMessage: 'Collection introuvable',
		});

	return category as CategoryWithCollectibles;
});