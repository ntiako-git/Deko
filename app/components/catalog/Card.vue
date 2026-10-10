<script setup lang="ts">
import type { DecorationProduct } from "#server/api/catalog/decorations.get.ts";

const props = defineProps<{
	product: DecorationProduct
}>();

const price = computed(() => {
	const internationalNumberFormat = new Intl.NumberFormat('fr-FR', {
		style: 'currency',
		currency: 'EUR'
	});

	const prices = [];

	if (props.product.priceEur != null)
		prices.push(internationalNumberFormat.format(props.product.priceEur / 100));

	if (props.product.priceOrbs != null)
		prices.push(`${props.product.priceOrbs} orbs`);

	return prices.length > 0 ? prices.join(' · ') : '???';
});
</script>

<template>
	<div class="flex flex-col bg-[#1c1d21] rounded-xl overflow-hidden hover:bg-[#232428] transition-colors cursor-pointer p-4 group">
		<!-- Image Preview -->
		<div class="flex-1 flex items-center justify-center min-h-40 mb-4">
			<img
				v-if="product.avatarDecoration?.asset"
				:src="`https://cdn.discordapp.com/avatar-decoration-presets/${product.avatarDecoration.asset}.png`"
				:alt="product.name"
				class="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-300"
			/>
		</div>

		<!-- Infos -->
		<div class="flex flex-col gap-1">
			<h3 class="text-white font-semibold text-sm truncate" :title="product.name">
				{{ product.name }}
			</h3>
			<!-- Le prix n'est pas dans le schéma Prisma actuel, on mock à 5.99€ comme sur la maquette -->
			<span class="text-gray-400 text-xs font-medium">x€</span>
		</div>
	</div>
</template>