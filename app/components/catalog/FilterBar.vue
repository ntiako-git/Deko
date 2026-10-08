<script setup lang="ts">
import { computed } from 'vue';
import UiSelect from '~/components/ui/Select.vue';

const props = defineProps<{
	categories: { id: string; name: string }[]
}>();

// v-model synchronisés avec le composant parent
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
	<div class="panel p-2.5 flex justify-between items-center mt-6">
		<!-- Recherche -->
		<div class="flex items-center gap-2 px-3 w-full max-w-sm">
			<Icon name="lucide:search" class="w-5 h-5 text-gray-400" />
			<input
				v-model="searchQuery"
				type="text"
				placeholder="Rechercher un objet de collection..."
				class="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500"
			/>
		</div>

		<!-- Sélecteur de Collection -->
		<UiSelect
			v-model="selectedCategory"
			:options="selectOptions"
			placeholder="Toutes les collections"
		/>
	</div>
</template>