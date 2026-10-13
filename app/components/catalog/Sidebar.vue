<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCatalogNavigation } from '~/composables/useCatalogNavigation';
import NavigationTabs from './NavigationTabs.vue';
import SearchBar from '../ui/SearchBar.vue';
import CollectionPicker from './CollectionPicker.vue';
import CollectionSheet from './CollectionSheet.vue';

const props = defineProps<{
	categories: { id: string; name: string; count: number }[];
	loading: boolean;
	/** Nombre d'objets du type sélectionné */
	totalCount: number;
	/** Nombre d'objets après recherche/filtres */
	resultCount: number;
}>();

const selectedCategories = defineModel<string[]>('selectedCategories', { default: () => [] });
const searchQuery = defineModel<string>('searchQuery', { default: '' });

const { sections, activeTab } = useCatalogNavigation();
const activeSection = computed(() => sections.find(s => s.id === activeTab.value) ?? sections[0]);

const sheetOpen = ref(false);

const plural = (n: number) => `${n} ${n > 1 ? 'objets' : 'objet'}`;
const countLabel = computed(() =>
	props.resultCount === props.totalCount
		? plural(props.totalCount)
		: `${props.resultCount} sur ${plural(props.totalCount)}`
);
</script>

<template>
	<aside class="flex flex-col gap-4 lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)]">
		<header class="min-w-0">
			<h1 class="text-heading truncate">{{ activeSection.name }}</h1>
			<p class="text-sm text-gray-400 mt-0.5 tabular-nums min-h-5">
				<span v-if="loading" class="inline-block h-4 w-20 rounded skeleton-shimmer align-middle"></span>
				<template v-else>{{ countLabel }}</template>
			</p>
		</header>

		<NavigationTabs />

		<!-- Barre de recherche + Filtre de collection -->
		<div class="flex gap-2">
			<SearchBar v-model="searchQuery" placeholder="Rechercher un objet" class="flex-1 min-w-0" />

			<!-- Filtre de collection (Mobile) -->
			<button
				type="button"
				@click="sheetOpen = true"
				aria-label="Filtrer par collection"
				class="lg:hidden relative shrink-0 panel h-11 px-3.5 flex items-center gap-2 border border-accent/30 text-sm font-medium text-gray-200 hover:border-accent/50 active:border-accent/50 transition-colors cursor-pointer"
			>
				<Icon name="lucide:sliders-horizontal" class="w-4! h-4! text-white" />
				<span class="hidden sm:inline">Collections</span>
				<span
					v-if="selectedCategories.length"
					class="min-w-5 h-5 px-1 rounded-full bg-accent text-white text-[11px] font-semibold flex items-center justify-center tabular-nums absolute -top-1.5 -right-1.5 sm:static"
				>
					{{ selectedCategories.length }}
				</span>
			</button>
		</div>

		<!-- Filtre de collection (Desktop) -->
		<div class="hidden lg:flex flex-col min-h-0 panel p-3 border border-accent/30">
			<CollectionPicker v-model="selectedCategories" :options="categories" :loading="loading" class="min-h-0" />
		</div>

		<CollectionSheet
			v-model:open="sheetOpen"
			v-model:selected="selectedCategories"
			:options="categories"
			:loading="loading"
			:result-count="resultCount"
		/>
	</aside>
</template>