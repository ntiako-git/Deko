declare module '#auth-utils' {
	interface User {
		id: string;
		username: string;
		avatar: string | null;
		locale: string;
		nitro: boolean;
		onboarded: boolean;
	}
}

export {}