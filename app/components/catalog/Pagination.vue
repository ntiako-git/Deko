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
	<div v-if="totalPages > 1" class="flex items-center justify-center gap-4 w-fit mx-auto">
		<button
			@click="prevPage"
			:disabled="currentPage <= 1"
			class="flex p-1.5 rounded-lg bg-[#232428] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2b2d31] transition-colors cursor-pointer"
		>
			<Icon name="lucide:chevron-left" class="w-4! h-4!" />
		</button>

		<span class="text-sm font-semibold text-gray-200 tracking-wider">
			{{ currentPage }} / {{ totalPages }}
		</span>

		<button
			@click="nextPage"
			:disabled="currentPage >= totalPages"
			class="flex p-1.5 rounded-lg bg-[#232428] text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#2b2d31] transition-colors cursor-pointer"
		>
			<Icon name="lucide:chevron-right" class="w-4! h-4!" />
		</button>
	</div>
</template>