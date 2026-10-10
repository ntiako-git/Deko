<script setup lang="ts">
import { computed } from 'vue';
import UiSelect from '~/components/ui/Select.vue';

const props = defineProps<{
	categories: { id: string; name: string }[]
}>();

const selectedCategory = defineModel<string>('selectedCategory', { default: '' });
const searchQuery = defineModel<string>('searchQuery', { default: '' });

const selectOptions = computed(() => {
	return props.categories.map(c => ({
		value: c.id,
		label: c.name
	}));
});
</script>

<template>
	<div class="panel p-2.5 flex justify-between items-center mt-6 border border-accent/30 shadow-lg">
		<!-- Recherche -->
		<div class="flex items-center gap-2 px-3 w-full">
			<Icon name="lucide:search" class="w-4! h-4! text-gray-400 shrink-0" />
			<!-- TODO Placeholder dynamique, change toutes les x secondes avec animation -->
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Rechercher ou categorie:nom..."
				class="bg-transparent border-none text-sm w-full text-white placeholder-gray-500"
			/>
		</div>

		<!-- Sélecteur de Collection -->
		<UiSelect
			v-model="selectedCategory"
			:options="selectOptions"
			placeholder="Toutes les collections"
			:icon-only-mobile="true"
		/>
	</div>
</template>