import { prisma } from '#server/utils/db';
import { CollectibleType } from '~~/prisma/generated/client';

interface OnboardingBody {
	profileEffectSkuId?: string | null;
	profileFrameSkuId?: string | null;
}

/**
 * undefined → champ absent
 * null → l'utilisateur n'en a pas
 * string → doit être un produit du bon type dans notre catalogue
 */
async function resolveSku(value: unknown, type: CollectibleType): Promise<string | null | undefined> {
	if (value === undefined) return undefined;
	if (value === null || value === '') return null;
	if (typeof value !== 'string')
		throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' });

	const product = await prisma.product.findFirst({ where: { id: value, type }, select: { id: true } });
	if (!product)
		throw createError({ statusCode: 400, statusMessage: 'Objet introuvable dans le catalogue' });

	return product.id;
}

export default defineEventHandler(async (event) => {
	const { user } = await requireUserSession(event);
	const body = await readBody<OnboardingBody>(event);

	const profileEffectSkuId = await resolveSku(body?.profileEffectSkuId, CollectibleType.PROFILE_EFFECT);
	const profileFrameSkuId = await resolveSku(body?.profileFrameSkuId, CollectibleType.PROFILE_FRAME);
	const now = new Date();

	await prisma.user.upsert({
		where: { id: user.id },
		create: {
			id: user.id,
			username: user.username,
			avatar: user.avatar,
			locale: user.locale,
			nitro: user.nitro,
			profileEffectSkuId: profileEffectSkuId ?? null,
			profileFrameSkuId: profileFrameSkuId ?? null,
			onboardedAt: now,
		},
		update: { profileEffectSkuId, profileFrameSkuId, onboardedAt: now },
	});

	await setUserSession(event, { user: { ...user, onboarded: true } });

	return { ok: true };
});