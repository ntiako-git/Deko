export interface UserProfile {
	nitro: boolean;
	avatarDecoration: { skuId: string; asset: string } | null;
	nameplate: { skuId: string; asset: string; label: string | null; palette: string | null } | null;
	profileEffectSkuId: string | null;
	profileFrameSkuId: string | null;
}

export interface PickedItem {
	id: string;
	name: string;
}