<script setup lang="ts">
import { computed } from 'vue';
import type { CategoryWithCollectibles } from '#shared/catalog.ts';

type ProductItem = CategoryWithCollectibles['products'][number];

/**
 * Aperçu d'un objet selon son type (extrait de Card.vue pour être réutilisé).
 * À placer dans une `.preview-stage`. Pour les cadres de profil, la scène doit avoir
 * une hauteur définie (h-64…), pas seulement une min-height.
 * `compact` : version réduite (mini-catalogue, scène h-36 / h-40).
 */
const props = defineProps<{
	product: ProductItem;
	compact?: boolean;
}>();

const size = computed(() => props.compact ? 'w-20 h-20' : 'w-28 h-28 sm:w-32 sm:h-32');
const effectSize = computed(() => props.compact ? 'w-24 h-full' : 'w-32 h-full');
const hover = computed(() => props.compact ? '' : 'group-hover:scale-105 transition-transform duration-300');
</script>

<template>
	<!-- Décorations d'avatar -->
	<img
		v-if="product.avatarDecoration?.asset"
		:src="`https://cdn.discordapp.com/avatar-decoration-presets/${product.avatarDecoration.asset}.png`"
		:alt="product.name"
		loading="lazy"
		decoding="async"
		class="object-contain"
		:class="[size, hover]"
	/>

	<!-- Effet de profil -->
	<img
		v-else-if="product.profileEffect?.thumbnailPreviewSrc"
		:src="product.profileEffect.thumbnailPreviewSrc"
		:alt="product.name"
		loading="lazy"
		decoding="async"
		class="object-contain"
		:class="[effectSize, hover]"
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
			class="object-contain"
			:class="[size, hover]"
		/>
		<img
			v-else
			:src="`https://cdn.discordapp.com/assets/collectibles/${product.nameplate.asset}static.png`"
			:alt="product.name"
			loading="lazy"
			decoding="async"
			class="object-contain"
			:class="[size, hover]"
		/>
	</template>

	<!-- Cadre de profil -->
	<div
		v-else-if="product.profileFrame"
		class="frame-preview-container"
		:class="compact ? 'h-64 scale-[.6]' : hover"
	>
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

	<img
		v-else-if="product.type === 'BUNDLE' && product.previewFgStatic"
		:src="product.previewFgStatic"
		:alt="product.name"
		loading="lazy"
		decoding="async"
		class="object-contain"
		:class="[effectSize, hover]"
	/>

	<!-- Fallback par défaut -->
	<div v-else class="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center">
		<Icon name="lucide:image" class="w-8 h-8 text-gray-500" />
	</div>
</template>