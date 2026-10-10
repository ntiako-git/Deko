<script setup lang="ts">
defineProps<{
	onReset: () => void;
}>();
</script>

<template>
	<div class="flex flex-col items-center justify-center py-20 mx-auto text-center gap-4 my-8">
		<div class="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
			<Icon name="lucide:search-x" class="text-accent w-5! h-5! md:w-10! md:h-10!" />
		</div>
		<div class="flex flex-col gap-1 max-w-sm md:max-w-md md:text-2xl">
			<h3 class="text-white font-semibold text-lg md:text-2xl">Aucun objet trouvé</h3>
			<p class="text-gray-400 text-sm md:text-xl">Aucun collectible ne correspond à vos critères de recherche actuels.</p>
		</div>
		<button
			@click="onReset"
			class="mt-2 bg-accent hover:bg-accent/80 active:scale-95 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-[colors,transform] cursor-pointer flex items-center gap-2 shadow-md shadow-accent/25"
		>
			<Icon name="lucide:rotate-ccw" class="w-4! h-4!" />
			Réinitialiser les filtres
		</button>
	</div>
</template>