<script setup lang="ts">
import { computed, ref } from 'vue';
import { normalizeText } from '~/utils/text';
import SearchBar from "~/components/ui/SearchBar.vue";

type Option = { id: string; name: string; count: number };

const props = defineProps<{
	options: Option[];
	loading?: boolean;
}>();

const selected = defineModel<string[]>({ default: () => [] });
const filter = ref('');

const visibleOptions = computed(() => {
	const q = normalizeText(filter.value.trim());
	return q ? props.options.filter(o => normalizeText(o.name).includes(q)) : props.options;
});

const isSelected = (id: string) => selected.value.includes(id);

const toggle = (id: string) => {
	selected.value = isSelected(id)
		? selected.value.filter(x => x !== id)
		: [...selected.value, id];
};

const clear = () => { selected.value = []; };

// Sélectionner toutes les collections trouvées par le filtre en une seule fois
const selectVisible = () => {
	selected.value = [...new Set([...selected.value, ...visibleOptions.value.map(o => o.id)])];
};
</script>

<template>
	<div class="flex flex-col gap-3 min-h-0">
		<!-- En tête -->
		<div class="flex items-center justify-between gap-2 px-1">
			<h2 class="text-sm font-semibold text-white flex items-center gap-2">
				Collections
				<span
					v-if="selected.length"
					class="bg-accent/20 text-accent text-[11px] font-semibold px-1.5 py-0.5 rounded-md tabular-nums"
				>
					{{ selected.length }}
				</span>
			</h2>
			<button
				v-if="selected.length"
				type="button"
				@click="clear"
				class="text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
			>
				Tout effacer
			</button>
		</div>

		<SearchBar v-model="filter" placeholder="Filtrer les collections" class="py-2" />

		<!-- Sélectionner toutes les collections compatibles avec la recherche -->
		<button
			v-if="filter && visibleOptions.length > 1"
			type="button"
			@click="selectVisible"
			class="self-start text-xs font-medium text-accent hover:text-white transition-colors cursor-pointer"
		>
			Sélectionner les {{ visibleOptions.length }} résultats
		</button>

		<!-- Liste -->
		<ul v-if="loading" class="flex flex-col gap-0.5" aria-hidden="true">
			<li v-for="i in 6" :key="i" class="h-11 rounded-lg skeleton-shimmer"></li>
		</ul>

		<p v-else-if="visibleOptions.length === 0" class="px-1 py-6 text-center text-sm text-gray-500">
			Aucune collection ne correspond.
		</p>

		<ul v-else class="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
			<li v-for="option in visibleOptions" :key="option.id">
				<label
					class="relative flex items-center gap-3 px-2.5 min-h-11 rounded-lg cursor-pointer select-none transition-colors"
					:class="[
						isSelected(option.id) ? 'bg-accent/10' : 'hover:bg-white/5',
						option.count === 0 && !isSelected(option.id) ? 'opacity-40' : ''
					]"
				>
					<input
						type="checkbox"
						class="peer sr-only"
						:checked="isSelected(option.id)"
						@change="toggle(option.id)"
					/>
					<span
						class="size-5 shrink-0 rounded-md border flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/60"
						:class="isSelected(option.id) ? 'bg-accent border-accent' : 'border-gray-600'"
					>
						<Icon v-if="isSelected(option.id)" name="lucide:check" class="w-3.5! h-3.5! text-white" />
					</span>
					<span
						class="flex-1 truncate text-sm"
						:class="isSelected(option.id) ? 'text-white font-medium' : 'text-gray-300'"
						:title="option.name"
					>
						{{ option.name }}
					</span>
					<span class="text-xs text-gray-500 tabular-nums">{{ option.count }}</span>
				</label>
			</li>
		</ul>
	</div>
</template>