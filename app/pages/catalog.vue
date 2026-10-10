<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CategoryWithDecorations } from '~~/server/api/catalog/decorations.get';
import NavigationMobile from '~/components/catalog/NavigationMobile.vue';
import NavigationDesktop from '~/components/catalog/NavigationDesktop.vue';
import CatalogFilterBar from '~/components/catalog/FilterBar.vue';
import CatalogSkeleton from '~/components/ui/CatalogSkeleton.vue';
import CatalogError from '~/components/catalog/CatalogError.vue';
import CatalogEmpty from '~/components/catalog/CatalogEmpty.vue';
import CatalogCategorySection from '~/components/catalog/CategorySection.vue';

const { data: categories, pending, error, refresh } = await useFetch<CategoryWithDecorations[]>('/api/catalog/decorations');

const selectedCategoryId = ref('');
const searchQuery = ref('');

const filteredCategories = computed(() => {
	if (!categories.value) return [];

	let result = categories.value;

	if (selectedCategoryId.value)
		result = result.filter(cat => cat.id === selectedCategoryId.value);

	if (searchQuery.value) {
		const rawQuery = searchQuery.value.trim().toLowerCase();

		const categoryPrefix = "categorie:";

		if (rawQuery.startsWith(categoryPrefix)) {
			const searchCatTerm = rawQuery.slice(categoryPrefix.length).trim();
			if (searchCatTerm)
				result = result.filter(cat => cat.name.toLowerCase().includes(searchCatTerm));
		} else {
			result = result.map(cat => {
				return {
					...cat,
					products: cat.products.filter(p => p.name.toLowerCase().includes(rawQuery))
				};
			}).filter(cat => cat.products.length > 0);
		}
	}

	return result;
});

const handleResetFilters = () => {
	selectedCategoryId.value = '';
	searchQuery.value = '';
};
</script>

<template>
	<div class="flex flex-col pb-12">
		<NavigationMobile />

		<CatalogFilterBar
			v-if="categories"
			:categories="categories.map(c => ({ id: c.id, name: c.name }))"
			v-model:selected-category="selectedCategoryId"
			v-model:search-query="searchQuery"
		/>

		<NavigationDesktop />

		<!-- États asynchrones -->
		<CatalogSkeleton v-if="pending" />
		<CatalogError v-else-if="error" :on-retry="refresh" />

		<template v-else>
			<CatalogEmpty
				v-if="filteredCategories.length === 0"
				:on-reset="handleResetFilters"
			/>

			<div v-else class="flex flex-col gap-8 mt-2">
				<CatalogCategorySection
					v-for="category in filteredCategories"
					:key="category.id"
					:category="category"
				/>
			</div>
		</template>
	</div>
</template>