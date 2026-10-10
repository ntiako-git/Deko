<script setup lang="ts">
defineProps<{
	onRetry: () => void;
}>();
</script>

<template>
	<div class="flex flex-col items-center justify-center py-20 mx-auto text-center gap-4 my-8">
		<div class="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
			<Icon name="lucide:alert-circle" class="text-red-400 w-5! h-5! md:w-10! md:h-10!" />
		</div>
		<div class="flex flex-col gap-1 max-w-sm md:max-w-md">
			<h3 class="text-white font-semibold text-lg md:text-2xl">Impossible de charger le catalogue</h3>
			<p class="text-gray-400 text-sm md:text-xl">Une erreur est survenue lors de la récupération des collections depuis le serveur.</p>
		</div>
		<button
			@click="onRetry"
			class="mt-2 bg-accent hover:bg-accent/80 active:scale-95 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-[colors,transform] cursor-pointer flex items-center gap-2 shadow-md shadow-accent/25"
		>
			<Icon name="lucide:rotate-cw" class="w-4! h-4!" />
			Réessayer
		</button>
	</div>
</template>