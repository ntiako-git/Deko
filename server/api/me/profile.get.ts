import { prisma } from '#server/utils/db';
import type { UserProfile } from '#shared/profile';

export default defineEventHandler(async (event): Promise<UserProfile> => {
	const { user } = await requireUserSession(event);
	const row = await prisma.user.findUnique({ where: { id: user.id } });

	return {
		nitro: row?.nitro ?? user.nitro,
		avatarDecoration: row?.avatarDecorationSkuId && row.avatarDecorationAsset
			? { skuId: row.avatarDecorationSkuId, asset: row.avatarDecorationAsset }
			: null,
		nameplate: row?.nameplateSkuId && row.nameplateAsset
			? {
				skuId: row.nameplateSkuId,
				asset: row.nameplateAsset,
				label: row.nameplateLabel,
				palette: row.nameplatePalette,
			}
			: null,
		profileEffectSkuId: row?.profileEffectSkuId ?? null,
		profileFrameSkuId: row?.profileFrameSkuId ?? null,
	};
});