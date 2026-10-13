<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { CategoryWithCollectibles } from '#shared/catalog.ts';
import type { PickedItem } from '#shared/profile';
import { normalizeText } from '~/utils/text';
import ProductPreview from '~/components/catalog/ProductPreview.vue';

type Product = CategoryWithCollectibles['products'][number];

const props = defineProps<{
	type: 'effects' | 'frames';
}>();

const picked = defineModel<PickedItem | null>({ default: null });

const copy = computed(() => props.type === 'effects'
	? { title: 'Votre effet de profil', text: 'Quel effet de profil utilisez-vous sur Discord ? Recherchez-le par nom ou par collection.' }
	: { title: 'Votre cadre de profil', text: 'Quel cadre de profil utilisez-vous sur Discord ? Recherchez-le par nom ou par collection.' }
);

const { data, status, error, refresh } = useFetch<CategoryWithCollectibles[]>('/api/catalog/collectibles', {
	query: { type: props.type },
	server: false,
	lazy: true,
});

const search = ref('');
const PAGE_SIZE = 24;
const limit = ref(PAGE_SIZE);
watch(search, () => { limit.value = PAGE_SIZE; });

const items = computed(() =>
	(data.value ?? []).flatMap(category =>
		category.products.map(product => ({
			product,
			haystack: normalizeText(`${product.name} ${category.name}`),
		}))
	)
);

const filtered = computed(() => {
	const q = normalizeText(search.value.trim());
	return q ? items.value.filter(i => i.haystack.includes(q)) : items.value;
});

const visible = computed(() => filtered.value.slice(0, limit.value));
const remaining = computed(() => filtered.value.length - visible.value.length);

const toggle = (product: Product) => {
	picked.value = picked.value?.id === product.id ? null : { id: product.id, name: product.name };
};
</script>

<template>
	<div class="flex flex-col gap-10 md:gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold text-white">{{ copy.title }}</h2>
			<p class="text-sm text-gray-300">{{ copy.text }}</p>
		</div>

		<!-- Recherche -->
		<div class="sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[#1c1d21] flex flex-col gap-2">
			<label class="flex items-center gap-2 h-11 px-3.5 rounded-xl bg-[#232428] border border-transparent focus-within:border-accent/50 transition-colors cursor-text">
				<Icon name="lucide:search" class="w-4! h-4! text-gray-500 shrink-0" />
				<input
					v-model="search"
					type="search"
					autocomplete="off"
					enterkeyhint="search"
					placeholder="Rechercher un nom ou une collection"
					aria-label="Rechercher dans le catalogue"
					class="min-w-0 flex-1 bg-transparent text-base sm:text-sm text-white placeholder-gray-500 appearance-none [&::-webkit-search-cancel-button]:appearance-none"
				/>
			</label>

			<p v-if="picked" class="flex items-center justify-between gap-2 text-sm">
				<span class="truncate text-gray-300">
					Sélectionné : <span class="text-white font-medium">{{ picked.name }}</span>
				</span>
				<button type="button" @click="picked = null" class="shrink-0 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">
					Retirer
				</button>
			</p>
		</div>

		<!-- États -->
		<div v-if="status === 'pending' || status === 'idle'" class="grid grid-cols-3 gap-2" aria-hidden="true">
			<div v-for="i in 9" :key="i" class="h-44 rounded-xl skeleton-shimmer"></div>
		</div>

		<div v-else-if="error" class="flex flex-col items-center gap-3 py-8 text-center">
			<p class="text-sm text-gray-300">Impossible de charger le catalogue.</p>
			<button type="button" @click="() => refresh()" class="h-10 px-4 rounded-xl bg-accent hover:bg-accent/80 text-white text-sm font-medium cursor-pointer transition-colors">
				Réessayer
			</button>
		</div>

		<p v-else-if="filtered.length === 0" class="py-8 text-center text-sm text-gray-400">
			Aucun objet ne correspond à « {{ search }} ».
		</p>

		<template v-else>
			<ul class="grid grid-cols-3 gap-2">
				<li v-for="{ product } in visible" :key="product.id">
					<button
						type="button"
						@click="toggle(product)"
						:aria-pressed="picked?.id === product.id"
						class="relative w-full flex flex-col gap-1.5 p-1 rounded-xl text-left cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-accent/60"
						:class="picked?.id === product.id ? 'bg-accent/15 ring-2 ring-accent' : 'hover:bg-white/5'"
					>
						<div class="relative flex items-center justify-center overflow-hidden rounded-lg" :class="type === 'frames' ? 'h-40' : 'h-36'">
							<ProductPreview :product="product" compact />
						</div>
						<span class="px-1 pb-0.5 text-xs text-gray-200 truncate" :title="product.name">{{ product.name }}</span>

						<span
							v-if="picked?.id === product.id"
							class="absolute top-2 right-2 size-5 rounded-full bg-accent flex items-center justify-center"
						>
							<Icon name="lucide:check" class="w-3.5! h-3.5! text-white" />
						</span>
					</button>
				</li>
			</ul>

			<button
				v-if="remaining > 0"
				type="button"
				@click="limit += PAGE_SIZE"
				class="h-11 rounded-xl bg-[#232428] hover:bg-[#2b2d31] text-sm font-medium text-gray-200 transition-colors cursor-pointer"
			>
				Afficher {{ Math.min(remaining, PAGE_SIZE) }} de plus ({{ remaining }} restants)
			</button>
		</template>
	</div>
</template>