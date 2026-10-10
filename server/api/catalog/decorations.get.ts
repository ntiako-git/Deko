import { prisma } from "#server/utils/db";
import { Prisma } from "~~/prisma/generated/client";

const categorySelect = {
	id: true,
	name: true,
	logoUrl: true,
	pdpBgUrl: true,
	mobileBannerUrl: true,
	catalogBannerUrl: true,
	heroBannerUrl: true,
	products: {
		where: { type: "AVATAR_DECORATION" }, // filtre les produits inclus
		orderBy: { name: "asc" },
		select: {
			id: true,
			name: true,
			priceEur: true,
			priceOrbs: true,
			avatarDecoration: { select: { asset: true, animated: true } },
		},
	},
} satisfies Prisma.CategorySelect;

// On exporte le type généré par Prisma pour le réutiliser côté frontend
export type CategoryWithDecorations = Prisma.CategoryGetPayload<{ select: typeof categorySelect }>;
export type DecorationProduct = CategoryWithDecorations["products"][number];

export default defineEventHandler(async (): Promise<CategoryWithDecorations[]> => {
	// On ne veut que les catégories qui ont des décorations
	return await prisma.category.findMany({
		where: { products: { some: { type: "AVATAR_DECORATION" } } },
		select: categorySelect,
		orderBy: { name: 'asc' } // TODO Peut être utiliser heroRanking ?
	});
});