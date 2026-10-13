<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { type CategoryWithCollectibles } from '#shared/catalog.ts';
import { normalizeText } from '~/utils/text';
import CatalogSidebar from '~/components/catalog/Sidebar.vue';
import CatalogSkeleton from '~/components/ui/CatalogSkeleton.vue';
import CatalogEmpty from '~/components/catalog/CatalogEmpty.vue';
import CatalogCategorySection from '~/components/catalog/CategorySection.vue';
import CatalogPagination from '~/components/catalog/Pagination.vue';
import Error from "~/components/ui/Error.vue";

const { activeTab } = useCatalogNavigation();

// TODO Charger 2 pages de catégories au lieu de tout charger d'un coup
const { data: categories, pending, error, refresh } = await useFetch<CategoryWithCollectibles[]>('/api/catalog/collectibles', { query: { type: activeTab } });

const selectedCategoryIds = ref<string[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const ITEMS_PER_PAGE = 5;

watch(activeTab, () => {
	selectedCategoryIds.value = [];
	searchQuery.value = '';
	currentPage.value = 1;
});

watch([selectedCategoryIds, searchQuery], () => {
	currentPage.value = 1;
});

const query = computed(() => normalizeText(searchQuery.value.trim()));

const matchingProducts = (cat: CategoryWithCollectibles) =>
	query.value
		? cat.products.filter(p => normalizeText(p.name).includes(query.value))
		: cat.products;

const allCategories = computed(() => (pending.value ? [] : categories.value ?? []));

const filteredCategories = computed(() => {
	let result = allCategories.value;

	if (selectedCategoryIds.value.length)
		result = result.filter(cat => selectedCategoryIds.value.includes(cat.id));

	if (query.value)
		result = result
			.map(cat => ({ ...cat, products: matchingProducts(cat) }))
			.filter(cat => cat.products.length > 0);

	return result;
});

const pickerOptions = computed(() =>
	allCategories.value.map(c => ({ id: c.id, name: c.name, count: matchingProducts(c).length }))
);

const totalCount = computed(() => allCategories.value.reduce((sum, c) => sum + c.products.length, 0));
const resultCount = computed(() => filteredCategories.value.reduce((sum, c) => sum + c.products.length, 0));

const selectedChips = computed(() =>
	pickerOptions.value.filter(o => selectedCategoryIds.value.includes(o.id))
);

const totalPages = computed(() => Math.ceil(filteredCategories.value.length / ITEMS_PER_PAGE));

const paginatedCategories = computed(() => {
	const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
	return filteredCategories.value.slice(start, start + ITEMS_PER_PAGE);
});

const handlePageChange = () => {
	window.scrollTo({ top: 0, behavior: 'smooth' });
};

const removeCategory = (id: string) => {
	selectedCategoryIds.value = selectedCategoryIds.value.filter(x => x !== id);
};

const handleResetFilters = () => {
	selectedCategoryIds.value = [];
	searchQuery.value = '';
	currentPage.value = 1;
};
</script>

<template>
	<div class="pt-6 lg:pt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-8 lg:items-start">
		<CatalogSidebar
			v-model:selected-categories="selectedCategoryIds"
			v-model:search-query="searchQuery"
			:categories="pickerOptions"
			:loading="pending"
			:total-count="totalCount"
			:result-count="resultCount"
		/>

		<main class="min-w-0 flex flex-col gap-6">
			<!-- Collections sélectionnées (Mobile) -->
			<div v-if="selectedChips.length" class="flex flex-wrap items-center gap-2 lg:hidden">
				<button
					v-for="chip in selectedChips"
					:key="chip.id"
					type="button"
					@click="removeCategory(chip.id)"
					:aria-label="`Retirer la collection ${chip.name}`"
					class="flex items-center gap-1.5 h-8 pl-3 pr-2 rounded-lg bg-accent/15 text-accent text-xs font-medium"
				>
					{{ chip.name }}
					<Icon name="lucide:x" class="w-3.5! h-3.5!" />
				</button>
				<button
					type="button"
					@click="selectedCategoryIds = []"
					class="px-1 text-xs font-medium text-gray-400 active:text-white transition-colors"
				>
					Tout effacer
				</button>
			</div>

			<!-- États asynchrones -->
			<CatalogSkeleton v-if="pending" />
			<Error
				v-else-if="error"
				title="Impossible de charger le catalogue"
				description="Une erreur est survenue lors de la récupération des collections depuis le serveur."
				btnLabel="Réessayer"
				btnIcon="lucide:rotate-cw"
				:action="refresh"
			/>

			<template v-else>
				<CatalogEmpty
					v-if="filteredCategories.length === 0"
					:on-reset="handleResetFilters"
				/>

				<template v-else>
					<div class="flex flex-col gap-10">
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
				</template>
			</template>
		</main>
	</div>
</template>