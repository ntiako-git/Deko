<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CatalogCard from '~/components/catalog/Card.vue';
import Error from "~/components/ui/Error.vue";
import { type CategoryWithCollectibles } from "#shared/catalog.ts";

const route = useRoute();
const categoryId = route.params.id as string;

const { data: category, pending, error } = await useFetch<CategoryWithCollectibles>(`/api/catalog/collections/${categoryId}`);

const typeLabels: Record<string, { label: string; icon: string }> = {
	AVATAR_DECORATION: { label: "Décorations d'avatar", icon: "lucide:square-user" },
	PROFILE_EFFECT: { label: "Effets de profil", icon: "lucide:wand-sparkles" },
	NAMEPLATE: { label: "Plaques nominatives", icon: "lucide:tag" },
	PROFILE_FRAME: { label: "Cadres de profil", icon: "lucide:square-dashed" },
};

const totalItems = computed(() => category.value?.products?.length ?? 0);
const avatarDecorations = computed(() => category.value?.products?.filter(prod => prod.type === 'AVATAR_DECORATION').length ?? 0);
const profileEffects = computed(() => category.value?.products?.filter(prod => prod.type === 'PROFILE_EFFECT').length ?? 0);
const nameplates = computed(() => category.value?.products?.filter(prod => prod.type === 'NAMEPLATE').length ?? 0);
const bundles = computed(() => category.value?.products?.filter(prod => prod.type === 'BUNDLE').length ?? 0);

const groupedProducts = computed(() => {
	if (!category.value?.products) return {};

	const groups: Record<string, typeof category.value.products> = {};
	for (const product of category.value.products) {
		if (!groups[product.type])
			groups[product.type] = [];
		groups[product.type]?.push(product);
	}
	return groups;
});

const desktopBanner = computed(() => category.value?.catalogBannerUrl ?? category.value?.heroBannerUrl ?? category.value?.pdpBgUrl);
</script>

<template>
	<div class="flex flex-col">
		<!-- États asynchrones -->
		<!-- TODO remplacer par du skeleton -->
		<div v-if="pending" class="text-center py-32 text-gray-400">
			Chargement de la collection...
		</div>
		<Error
			v-else-if="error"
			title="Collection introuvable"
			description="La collection que vous essayez de consulter n'existe pas ou a été supprimée."
			btnLabel="Retour au catalogue"
			path="/catalog"
		/>

		<!-- Contenu de la collection -->
		<template v-else>
			<!-- Grande bannière pleine largeur -->
			<div class="relative w-full h-40 md:h-48 rounded-2xl overflow-hidden panel mb-4">
				<div v-if="categoryId === 'other-collectibles'" class="bg-linear-to-r from-accent/20 via-[#1c1d21] to-accent/10 flex items-center justify-center p-8">
					<div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-accent/15 via-transparent to-transparent"></div>
					<div class="relative z-10 flex flex-col items-center gap-2 text-center">
						<Icon name="lucide:package-open" class="w-10! h-10! text-accent" />
						<h1 class="text-xl font-bold text-white">{{ category.name }}</h1>
						<p class="text-xs text-gray-400">{{ category.summary }}</p>
					</div>
				</div>

				<template v-else>
					<picture v-if="desktopBanner || category.mobileBannerUrl">
						<source v-if="desktopBanner" media="(min-width: 768px)" :srcset="desktopBanner" />
						<img
							:src="category.mobileBannerUrl ?? desktopBanner!"
							:alt="category.name"
							class="absolute inset-0 w-full h-full object-cover object-left md:object-center"
						/>
					</picture>
					<div class="absolute inset-0 w-full h-full object-cover object-left md:object-center"></div>
				</template>
			</div>

			<div class="flex flex-col gap-8 max-w-6xl mx-auto w-full px-4 sm:px-6">
				<!-- En-tête et métriques de la collection -->
				<div class="flex flex-col gap-2.5">
					<h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-center">
						{{ category.name }}
					</h1>

					<p class="text-sm md:text-base text-center text-gray-400 max-w-100 mx-auto">
						{{ totalItems }} objets de collection Discord dans cette collection : {{ avatarDecorations }} décorations d'avatar, {{ profileEffects }} effets de profil, {{ nameplates }} plaques nominatives et {{ bundles }} packs.
					</p>
				</div>

				<!-- Groupement des collectibles par type -->
				<div class="flex flex-col gap-12">
					<div
						v-for="(products, type) in groupedProducts"
						:key="type"
						class="flex flex-col gap-6"
					>
						<!-- Titre de la sous-section par type -->
						<div class="flex items-center gap-2 pb-2 border-b border-accent/30">
							<div class="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
								<Icon :name="typeLabels[type]?.icon || 'lucide:box'" class="w-4! h-4!" />
							</div>
							<h2 class="text-xl font-bold text-white">
								{{ typeLabels[type]?.label || type }}
							</h2>
							<span class="text-xs text-gray-400 font-medium ml-auto">({{ products.length }})</span>
						</div>

						<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
							<CatalogCard
								v-for="product in products"
								:key="product.id"
								:product="product"
							/>
						</div>
					</div>
				</div>

				<!-- Retour catalog -->
				<div class="flex flex-col items-center justify-center pt-6 border-t border-accent/30 gap-4 text-center">
					<p class="text-gray-400 text-sm lg:text-base">Envie de découvrir davantage de décorations et d'effets exclusifs ?</p>
					<NuxtLink
						to="/catalog"
						class="group panel text-white px-6 py-3 rounded-xl font-medium text-sm lg:text-base flex items-center gap-2 border border-transparent hover:border-accent/30 cursor-pointer shadow-md hover:scale-105 active:scale-95 transition-[border-color,transform!] duration-300"
					>
						<Icon name="lucide:arrow-left" class="w-4! h-4! group-hover:-translate-x-1 transition-transform" />
						<span>Explorer tout le catalogue</span>
					</NuxtLink>
				</div>
			</div>
		</template>
	</div>
</template>