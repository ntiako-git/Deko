<script setup lang="ts">
import type { CategoryWithDecorations } from '~~/server/api/catalog/decorations.get';
import CatalogCard from './Card.vue';

const props = defineProps<{
	category: CategoryWithDecorations
}>();
const desktopBanner = computed(() => props.category.catalogBannerUrl ?? props.category.heroBannerUrl ?? props.category.pdpBgUrl)
</script>

<template>
	<section class="flex flex-col gap-6 py-6">
		<!-- Banner -->
		<div class="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden panel">
			<picture v-if="desktopBanner || category.mobileBannerUrl">
				<source v-if="desktopBanner" media="(min-width: 768px)" :srcset="desktopBanner" />
				<img
					:src="category.mobileBannerUrl ?? desktopBanner!"
					alt=""
					loading="lazy"
					decoding="async"
					class="absolute inset-0 w-full h-full object-cover object-left md:object-center"
				/>
			</picture>
		</div>

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