<script setup lang="ts">
const currentPage = defineModel<number>('page', { required: true });

const props = defineProps<{
	totalPages: number;
}>();

const emit = defineEmits(['change']);

const prevPage = () => {
	if (currentPage.value > 1) {
		currentPage.value--;
		emit('change');
	}
};

const nextPage = () => {
	if (currentPage.value < props.totalPages) {
		currentPage.value++;
		emit('change');
	}
};
</script>

<template>
	<nav v-if="totalPages > 1" aria-label="Pagination" class="flex items-center justify-center gap-4 w-fit mx-auto">
		<button
			@click="prevPage"
			:disabled="currentPage <= 1"
			aria-label="Page précédente"
			class="size-11 flex items-center justify-center rounded-xl bg-[#232428] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2b2d31] active:scale-95 transition-[colors,transform] cursor-pointer"
		>
			<Icon name="lucide:chevron-left" class="w-4! h-4!" />
		</button>

		<span class="text-sm font-semibold text-gray-200 tracking-wider tabular-nums">
			{{ currentPage }} / {{ totalPages }}
		</span>

		<button
			@click="nextPage"
			:disabled="currentPage >= totalPages"
			aria-label="Page suivante"
			class="size-11 flex items-center justify-center rounded-xl bg-[#232428] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2b2d31] active:scale-95 transition-[colors,transform] cursor-pointer"
		>
			<Icon name="lucide:chevron-right" class="w-4! h-4!" />
		</button>
	</nav>
</template>