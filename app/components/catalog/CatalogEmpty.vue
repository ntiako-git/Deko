<script setup lang="ts">
defineProps<{
	onReset: () => void;
}>();
</script>

<template>
	<div class="flex flex-col items-center justify-center py-16 mx-auto text-center gap-4">
		<div class="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
			<Icon name="lucide:search-x" class="text-accent w-7! h-7!" />
		</div>
		<div class="flex flex-col gap-1 max-w-sm">
			<h3 class="text-white font-semibold text-lg">Aucun objet trouvé</h3>
			<p class="text-gray-400 text-sm">Aucun collectible ne correspond à votre recherche ou aux collections sélectionnées.</p>
		</div>
		<button
			@click="onReset"
			class="mt-2 bg-accent hover:bg-accent/80 active:scale-95 text-white px-4 h-11 rounded-xl font-medium text-sm transition-[colors,transform] cursor-pointer flex items-center gap-2 shadow-md shadow-accent/25"
		>
			<Icon name="lucide:rotate-ccw" class="w-4! h-4!" />
			Réinitialiser les filtres
		</button>
	</div>
</template>