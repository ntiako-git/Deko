<script setup lang="ts">
import { computed } from 'vue';
import { type CategoryWithCollectibles } from '#shared/catalog.ts';
import CatalogCard from './Card.vue';

const props = defineProps<{
	category: CategoryWithCollectibles
}>();
const desktopBanner = computed(() => props.category.catalogBannerUrl ?? props.category.heroBannerUrl ?? props.category.pdpBgUrl)
</script>

<template>
	<section class="flex flex-col gap-4">
		<NuxtLink
			v-if="category.id === 'other-collectibles'"
			to="/catalog/collections/other-collectibles"
			class="relative w-full h-32 sm:h-40 md:h-48 rounded-2xl overflow-hidden panel bg-linear-to-r from-accent/20 via-[#1c1d21] to-accent/10 flex items-center justify-center p-6"
		>
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent"></div>
			<div class="relative z-10 flex flex-col items-center gap-2 text-center">
				<Icon name="lucide:package-open" class="w-9! h-9! text-accent" />
				<h3 class="text-lg font-bold text-white">{{ category.name }}</h3>
				<p class="text-xs text-gray-400">{{ category.summary }}</p>
			</div>
		</NuxtLink>

		<!-- Bannière -->
		<NuxtLink
			v-else
			:to="`/catalog/collections/${category.id}`"
			:aria-label="`Voir la collection ${category.name}`"
			class="relative block w-full h-32 sm:h-40 md:h-48 rounded-2xl overflow-hidden panel"
		>
			<picture v-if="desktopBanner || category.mobileBannerUrl">
				<source v-if="desktopBanner" media="(min-width: 768px)" :srcset="desktopBanner" />
				<img
					:src="category.mobileBannerUrl ?? desktopBanner!"
					:alt="category.name"
					loading="lazy"
					decoding="async"
					class="absolute inset-0 w-full h-full object-cover object-left"
				/>
			</picture>
		</NuxtLink>

		<!-- Titre -->
		<div class="flex items-baseline gap-2.5">
			<h2 class="text-xl sm:text-2xl font-bold text-white truncate">{{ category.name }}</h2>
			<span class="text-sm text-gray-500 tabular-nums shrink-0">{{ category.products.length }}</span>
		</div>

		<!-- Grille -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
			<CatalogCard
				v-for="product in category.products"
				:key="product.id"
				:product="product"
			/>
		</div>
	</section>
</template>