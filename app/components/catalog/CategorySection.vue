<script setup lang="ts">
import type { CategoryWithDecorations } from '~~/server/api/catalog/decorations.get';
import CatalogCard from './Card.vue';

defineProps<{
	category: CategoryWithDecorations
}>();
</script>

<template>
	<section class="flex flex-col gap-6 py-6">
		<!-- Banner -->
		<div class="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden panel">
			<template v-if="category.mobileBannerUrl">
				<img
					:src="category.mobileBannerUrl"
					:alt="category.name"
					class="absolute inset-0 w-full h-full object-cover"
				/>
			</template>
			<template v-else>
				<img
					:src="category.pdpBgUrl"
					:alt="category.name"
					class="absolute inset-0 w-full h-full object-cover"
				/>
				<div class="absolute inset-0 flex items-center p-8 bg-linear-to-r from-black/60 via-black/40 to-transparent">
					<img
						v-if="category.logoUrl"
						:src="category.logoUrl"
						:alt="category.name"
						class="h-20 object-contain drop-shadow-xl"
					/>
				</div>
			</template>
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