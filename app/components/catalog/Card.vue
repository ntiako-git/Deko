<script setup lang="ts">
import { computed } from 'vue';
import type { CategoryWithCollectibles } from "#shared/catalog.ts";
import ProductPreview from './ProductPreview.vue';

type ProductItem = CategoryWithCollectibles['products'][number];

const props = defineProps<{
	product: ProductItem
}>();

const { loggedIn, user } = useUserSession();

const internationalNumberFormat = new Intl.NumberFormat('fr-FR', {
	style: 'currency',
	currency: 'EUR'
});

const hasNitro = computed(() => loggedIn.value && user.value?.nitro === true);
const nitroPriceFormatted = computed(() => {
	if (props.product.priceEurNitro == null) return null;
	return internationalNumberFormat.format(props.product.priceEurNitro / 100);
});
const normalPriceFormatted = computed(() => {
	if (props.product.priceEur == null) return null;
	return internationalNumberFormat.format(props.product.priceEur / 100);
});
const discountPercentage = computed(() => {
	if (props.product.priceEur == null || props.product.priceEurNitro == null) return 0;
	const diff = props.product.priceEur - props.product.priceEurNitro;
	return Math.round((diff / props.product.priceEur) * 100);
});

const price = computed(() => {
	const prices = [];

	if (props.product.priceEur != null)
		prices.push(internationalNumberFormat.format(props.product.priceEur / 100));

	if (props.product.priceOrbs != null)
		prices.push(`${props.product.priceOrbs} orbs`);

	return prices.length > 0 ? prices.join(' · ') : '???';
});
</script>

<template>
	<article class="panel flex flex-col gap-3 p-2 group cursor-pointer hover:bg-[#232428] transition-colors">
		<!-- Scène d'aperçu : fond plus clair que la carte pour bien voir les animations -->
		<div class="preview-stage" :class="product.profileFrame ? 'h-64 sm:h-70' : 'min-h-40'">
			<ProductPreview :product="product" />
		</div>

		<!-- Infos -->
		<div class="flex flex-col gap-1 px-1.5 pb-1.5">
			<h3 class="text-white font-semibold text-sm truncate" :title="product.name">
				{{ product.name }}
			</h3>
			<div v-if="hasNitro && product.priceEurNitro != null" class="flex items-center gap-2 flex-wrap">
				<span class="text-accent font-bold text-xs">{{ nitroPriceFormatted }}</span>
				<span v-if="normalPriceFormatted" class="text-gray-500 text-xs line-through">{{ normalPriceFormatted }}</span>
				<span v-if="discountPercentage > 0" class="bg-accent/20 text-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
					-{{ discountPercentage }}%
				</span>
			</div>
			<span v-else class="text-gray-400 text-xs font-medium">{{ price }}</span>
		</div>
	</article>
</template>