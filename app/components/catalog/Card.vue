<script setup lang="ts">
import { computed } from 'vue';
import type { CategoryWithCollectibles } from "#shared/catalog.ts";

type ProductItem = CategoryWithCollectibles['products'][number];

const props = defineProps<{
	product: ProductItem
}>();

const { loggedIn, user } = useUserSession();

const internationalNumberFormat = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'EUR'
});

const hasNitro = computed(() => loggedIn.value && user.value?.nitro === true);
const nitroPriceFormatted = computed(() => {
	if (props.product.priceEurNitro == null) return null;
	return internationalNumberFormat.format(props.product.priceEurNitro / 100);
});
const normalPriceFormatted = computed(() => {
	if (props.product.priceEur == null) return null;
	return internationalNumberFormat.format(props.product.priceEur / 100);
});
const discountPercentage = computed(() => {
	if (props.product.priceEur == null || props.product.priceEurNitro == null) return 0;
	const diff = props.product.priceEur - props.product.priceEurNitro;
	return Math.round((diff / props.product.priceEur) * 100);
});

const price = computed(() => {
	const prices = [];

	if (props.product.priceEur != null)
		prices.push(internationalNumberFormat.format(props.product.priceEur / 100));

	if (props.product.priceOrbs != null)
		prices.push(`${props.product.priceOrbs} orbs`);

	return prices.length > 0 ? prices.join(' · ') : '???';
});
</script>

<template>
	<div class="flex flex-col bg-[#1c1d21] rounded-xl overflow-hidden hover:bg-[#232428] transition-colors cursor-pointer p-4 group">
		<!-- Image Preview selon le type -->
		<div class="flex-1 flex items-center justify-center mb-4" :class="product.profileFrame ? 'min-h-70' : 'min-h-40'">
			<!-- Décorations d'avatar -->
			<img
				v-if="product.avatarDecoration?.asset"
				:src="`https://cdn.discordapp.com/avatar-decoration-presets/${product.avatarDecoration.asset}.png`"
				:alt="product.name"
				class="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
			/>

			<!-- Effet de profil -->
			<img
				v-else-if="product.profileEffect?.thumbnailPreviewSrc"
				:src="product.profileEffect.thumbnailPreviewSrc"
				:alt="product.name"
				class="w-32 h-full object-contain group-hover:scale-105 transition-transform duration-300"
			/>

			<!-- Plaque nominative -->
			<template v-else-if="product.nameplate?.asset">
				<video
					v-if="product.nameplate.asset === 'nameplates/buffering.../1541529803809755246/'"
					src="/assets/videos/buffering"
					autoplay
					loop
					muted
					playsinline
					class="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
				/>
				<img
					v-else
					:src="`https://cdn.discordapp.com/assets/collectibles/${product.nameplate.asset}static.png`"
					:alt="product.name"
					class="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
				/>
			</template>

			<!-- Cadre de profil -->
			<div v-else-if="product.profileFrame" class="frame-preview-container group-hover:scale-105 transition-transform duration-300">
				<img
					v-for="layer in product.profileFrame.layers"
					:key="layer.assetId"
					:src="`https://cdn.discordapp.com/media/v1/collectibles-shop/${product.profileFrame.skuId}/${layer.assetId}/static`"
					class="frame-layer"
					:class="[
						layer.order === 'back' ? 'frame-layer-back' : 'frame-layer-front',
						layer.anchor === 'top' ? 'frame-anchor-top' : '',
						layer.anchor === 'bottom' ? 'frame-anchor-bottom' : '',
						layer.anchor === 'center' ? 'frame-anchor-center' : ''
					]"
					alt=""
					loading="lazy"
					decoding="async"
					draggable="false"
				/>
			</div>

			<!-- Fallback par défaut -->
			<div v-else class="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
				<Icon name="lucide:image" class="w-8 h-8 text-gray-500" />
			</div>
		</div>

		<!-- Infos -->
		<div class="flex flex-col gap-1">
			<h3 class="text-white font-semibold text-sm truncate" :title="product.name">
				{{ product.name }}
			</h3>
			<div v-if="hasNitro && product.priceEurNitro != null" class="flex items-center gap-2 flex-wrap">
				<span class="text-accent font-bold text-xs">{{ nitroPriceFormatted }}</span>
				<span v-if="normalPriceFormatted" class="text-gray-500 text-xs line-through">{{ normalPriceFormatted }}</span>
				<span v-if="discountPercentage > 0" class="bg-accent/20 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
					-{{ discountPercentage }}%
				</span>
			</div>
			<span v-else class="text-gray-400 text-xs font-medium">{{ price }}</span>
		</div>
	</div>
</template>