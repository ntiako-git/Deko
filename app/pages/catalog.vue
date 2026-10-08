<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CategoryWithDecorations } from '~~/server/api/catalog/decorations.get';
import LayoutAppHeader from '~/layout/AppHeader.vue';
import CatalogNavigation from '~/components/catalog/Navigation.vue';
import CatalogFilterBar from '~/components/catalog/FilterBar.vue';
import CatalogCategorySection from '~/components/catalog/CategorySection.vue';

const { data: categories, pending, error } = await useFetch<CategoryWithDecorations[]>('/api/catalog/decorations');

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
			if (searchCatTerm) {
				result = result.filter(cat => cat.name.toLowerCase().includes(searchCatTerm));
			}
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
</script>

<template>
	<div class="page-container flex flex-col min-h-screen pb-12">
		<!-- Header Global -->
		<LayoutAppHeader />

		<!-- Navigation des Types -->
		<CatalogNavigation />

		<!-- Barre de Recherche et Filtres -->
		<CatalogFilterBar
			v-if="categories"
			:categories="categories.map(c => ({ id: c.id, name: c.name }))"
			v-model:selected-category="selectedCategoryId"
			v-model:search-query="searchQuery"
		/>

		<!-- États asynchrones -->
		<div v-if="pending" class="text-center py-20 text-gray-400">
			Chargement du catalogue...
		</div>
		<div v-else-if="error" class="text-center py-20 text-red-400">
			Impossible de charger les collections.
		</div>

		<!-- Affichage des Collections Filtrées -->
		<div v-else class="flex flex-col gap-8 mt-4">
			<div v-if="filteredCategories.length === 0" class="text-center py-20 text-gray-500">
				Aucune décoration trouvée pour cette recherche.
			</div>

			<CatalogCategorySection
				v-for="category in filteredCategories"
				:key="category.id"
				:category="category"
			/>
		</div>
	</div>
</template>