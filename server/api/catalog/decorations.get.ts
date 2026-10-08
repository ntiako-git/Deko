import { prisma } from "#server/utils/db";
import { Prisma } from "~~/prisma/generated/client";

// On exporte le type généré par Prisma pour le réutiliser côté frontend
export type CategoryWithDecorations = Prisma.CategoryGetPayload<{
	include: {
		products: {
			include: { avatarDecoration: true }
		}
	}
}>;

export default defineEventHandler(async (): Promise<CategoryWithDecorations[]> => {
	return await prisma.category.findMany({
		where: {
			// On ne veut que les catégories qui ont des décorations
			products: {
				some: { type: "AVATAR_DECORATION" }
			}
		},
		include: {
			products: {
				where: { type: "AVATAR_DECORATION" }, // On filtre les produits inclus
				include: { avatarDecoration: true }   // On joint les données spécifiques
			}
		},
		orderBy: {
			name: 'asc' // Ordre alphabétique, ou tu peux utiliser heroRanking plus tard
		}
	});
});