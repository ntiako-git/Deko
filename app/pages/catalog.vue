<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CategoryWithCollectibles } from '~~/server/api/catalog/collectibles.get';
import NavigationMobile from '~/components/catalog/NavigationMobile.vue';
import NavigationDesktop from '~/components/catalog/NavigationDesktop.vue';
import CatalogFilterBar from '~/components/catalog/FilterBar.vue';
import CatalogSkeleton from '~/components/ui/CatalogSkeleton.vue';
import CatalogError from '~/components/catalog/CatalogError.vue';
import CatalogEmpty from '~/components/catalog/CatalogEmpty.vue';
import CatalogCategorySection from '~/components/catalog/CategorySection.vue';
import CatalogPagination from '~/components/catalog/Pagination.vue';

const { activeTab } = useCatalogNavigation();

// TODO Charger 2 pages de catégories au lieu de tout charger d'un coup
const { data: categories, pending, error, refresh } = await useFetch<CategoryWithCollectibles[]>('/api/catalog/collectibles', { query: { type: activeTab} });

const selectedCategoryId = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const ITEMS_PER_PAGE = 5;

watch(activeTab, () => {
	selectedCategoryId.value = '';
	searchQuery.value = '';
	currentPage.value = 1;
});

watch([selectedCategoryId, searchQuery], () => {
	currentPage.value = 1;
});

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

const totalPages = computed(() => {
	return Math.ceil(filteredCategories.value.length / ITEMS_PER_PAGE);
});

const paginatedCategories = computed(() => {
	const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
	const end = start + ITEMS_PER_PAGE;
	return filteredCategories.value.slice(start, end);
});

const handlePageChange = () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
};

const handleResetFilters = () => {
	selectedCategoryId.value = '';
	searchQuery.value = '';
	currentPage.value = 1;
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

			<div v-else class="flex flex-col gap-8 mt-6">
				<CatalogPagination
					v-if="totalPages > 1"
					v-model:page="currentPage"
					:total-pages="totalPages"
					@change="handlePageChange"
					class="-mb-8"
				/>

				<div class="flex flex-col gap-8">
					<CatalogCategorySection
						v-for="category in paginatedCategories"
						:key="category.id"
						:category="category"
					/>
				</div>

				<CatalogPagination
					v-if="totalPages > 1"
					v-model:page="currentPage"
					:total-pages="totalPages"
					@change="handlePageChange"
				/>
			</div>
		</template>
	</div>
</template>