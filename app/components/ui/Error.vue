<script setup lang="ts">
defineProps<{
	title: string;
	description: string;
	btnLabel: string;
	btnIcon?: string;
	action?: () => void;
	path?: string;
}>();
</script>

<template>
	<div class="flex flex-col items-center justify-center py-20 mx-auto text-center gap-4 my-8">
		<div class="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
			<Icon name="lucide:alert-circle" class="text-red-400 w-5! h-5! md:w-10! md:h-10!" />
		</div>
		<div class="flex flex-col gap-1 max-w-sm md:max-w-md">
			<h3 class="text-white font-semibold text-lg md:text-2xl">{{ title }}</h3>
			<p class="text-gray-400 text-sm md:text-xl">{{ description }}</p>
		</div>
		<template v-if="path">
			<NuxtLink :to="path" class="mt-2 bg-accent hover:bg-accent/80 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all">
				Retour au catalogue
			</NuxtLink>
		</template>
		<template v-else-if="action">
			<button
				@click="action"
				class="mt-2 bg-accent hover:bg-accent/80 active:scale-95 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-[colors,transform] cursor-pointer flex items-center gap-2 shadow-md shadow-accent/25"
			>
				<Icon v-if="btnIcon" :name="btnIcon" class="w-4! h-4!" />
				{{ btnLabel }}
			</button>
		</template>
	</div>
</template>