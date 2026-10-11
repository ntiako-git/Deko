export default defineOAuthDiscordEventHandler({
	config: {
		scope: ['identify']
	},
	async onSuccess(event, { user }) {
		// TODO récupérer les infos de avatar_decoration_data et collectibles
		// TODO save en bdd les infos
		await setUserSession(event, {
			user: {
				id: user.id,
				username: user.username,
				avatar: user.avatar,
				locale: user.locale,
				nitro: (user.premium_type ?? 0) > 0
			}
		})
		return sendRedirect(event, '/')
	},
	onError(event, error) {
		console.error('Discord OAuth error:', error)
		return sendRedirect(event, '/')
	},
})