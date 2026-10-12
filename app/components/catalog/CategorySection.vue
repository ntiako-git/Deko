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
	<section class="flex flex-col gap-6 py-6">
		<a
			v-if="category.id === 'other-collectibles'"
			href="/catalog/collections/other-collectibles"
			class="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden panel bg-linear-to-r from-accent/20 via-[#1c1d21] to-accent/10 flex items-center justify-center p-8"
		>
			<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent"></div>
			<div class="relative z-10 flex flex-col items-center gap-2 text-center">
				<Icon name="lucide:package-open" class="w-10! h-10! text-accent" />
				<h3 class="text-xl font-bold text-white">{{ category.name }}</h3>
				<p class="text-xs text-gray-400">{{ category.summary }}</p>
			</div>
		</a>

		<!-- Banner -->
		<a
			v-else
			:href="`/catalog/collections/${category.id}`"
			class="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden panel"
		>
			<picture v-if="desktopBanner || category.mobileBannerUrl">
				<source v-if="desktopBanner" media="(min-width: 768px)" :srcset="desktopBanner" />
				<img
					:src="category.mobileBannerUrl ?? desktopBanner!"
					:alt="category.name"
					loading="lazy"
					decoding="async"
					class="absolute inset-0 w-full h-full object-cover object-left md:object-center"
				/>
			</picture>
		</a>

		<!-- Title -->
		<h2 class="text-2xl font-bold text-white">{{ category.name }}</h2>

		<!-- Grid -->
		<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
			<CatalogCard
				v-for="product in category.products"
				:key="product.id"
				:product="product"
			/>
		</div>
	</section>
</template>