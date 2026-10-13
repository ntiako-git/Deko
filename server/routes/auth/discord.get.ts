interface DiscordUser {
	id: string;
	username: string;
	global_name?: string | null;
	avatar: string | null;
	locale?: string;
	premium_type?: number;
	avatar_decoration_data?: { asset: string; sku_id: string; expires_at?: string | null } | null;
	collectibles?: {
		nameplate?: { sku_id: string; asset: string; label: string; palette: string } | null;
	} | null;
}

export default defineOAuthDiscordEventHandler({
	config: {
		scope: ['identify']
	},
	async onSuccess(event, { user }) {
		const discordUser = user as DiscordUser;
		const decoration = discordUser.avatar_decoration_data ?? null;
		const nameplate = discordUser.collectibles?.nameplate ?? null;
		const nitro = (discordUser.premium_type ?? 0) > 0;

		let onboarded = true;

		try {
			const discordData = {
				username: discordUser.username,
				globalName: discordUser.global_name ?? null,
				avatar: discordUser.avatar,
				locale: discordUser.locale ?? null,
				nitro,
				avatarDecorationSkuId: decoration?.sku_id ?? null,
				avatarDecorationAsset: decoration?.asset ?? null,
				nameplateSkuId: nameplate?.sku_id ?? null,
				nameplateAsset: nameplate?.asset ?? null,
				nameplateLabel: nameplate?.label ?? null,
				nameplatePalette: nameplate?.palette ?? null,
			};

			const dbUser = await prisma.user.upsert({
				where: { id: discordUser.id },
				create: { id: discordUser.id, ...discordData },
				update: discordData,
				select: { onboardedAt: true },
			});

			onboarded = dbUser.onboardedAt !== null;
		} catch (error) {
			console.error('Discord OAuth: impossible d\'enregistrer l\'utilisateur', error);
		}

		await setUserSession(event, {
			user: {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				locale: user.locale,
				nitro,
				onboarded
			}
		})
		return sendRedirect(event, '/')
	},
	onError(event, error) {
		console.error('Discord OAuth error:', error)
		return sendRedirect(event, '/')
	},
})