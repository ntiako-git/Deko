<script setup lang="ts">
const model = defineModel<string>({ default: '' });
defineProps<{
	placeholder: string;
}>();
</script>

<template>
	<label class="panel flex items-center gap-2 h-11 px-3.5 border border-accent/30 focus-within:border-accent/50 transition-colors cursor-text">
		<Icon name="lucide:search" class="w-4! h-4! text-gray-400 shrink-0" />
		<input
			v-model="model"
			type="search"
			inputmode="search"
			enterkeyhint="search"
			autocomplete="off"
			:placeholder="placeholder"
			:aria-label="placeholder"
			class="min-w-0 flex-1 bg-transparent text-base sm:text-sm text-white placeholder-gray-500 appearance-none [&::-webkit-search-cancel-button]:appearance-none"
		/>
		<button
			v-if="model"
			type="button"
			@click.prevent="model = ''"
			aria-label="Effacer la recherche"
			class="shrink-0 size-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
		>
			<Icon name="lucide:x" class="w-3.5! h-3.5!" />
		</button>
	</label>
</template>