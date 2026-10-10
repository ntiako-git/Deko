<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

type Option = {
	value: string;
	label: string;
};

const props = defineProps<{
	options: Option[];
	placeholder?: string;
	iconOnlyMobile?: boolean;
}>();

const modelValue = defineModel<string>({ default: '' });

const isOpen = ref(false);
const selectContainer = ref<HTMLElement | null>(null);

const toggleOpen = () => {
	isOpen.value = !isOpen.value;
};

const selectOption = (value: string) => {
	modelValue.value = value;
	isOpen.value = false;
};

const selectedLabel = computed(() => {
	const option = props.options.find(opt => opt.value === modelValue.value);
	return option ? option.label : (props.placeholder || 'Sélectionner...');
});

// Fermer le select si on clique à l'extérieur
const handleClickOutside = (event: MouseEvent) => {
	if (selectContainer.value && !selectContainer.value.contains(event.target as Node))
		isOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
	<div class="relative min-w-1/5 max-w-1/5 w-full" ref="selectContainer">
		<button
			@click="toggleOpen"
			type="button"
			class="w-full bg-[#232428] hover:bg-[#2b2d31] text-gray-300 text-sm py-2 px-3 sm:px-4 rounded-xl flex items-center justify-between gap-2 border border-transparent focus:border-accent/30 transition-colors"
			:class="{ 'bg-[#2b2d31] border-accent/50': isOpen }"
		>
			<span class="truncate" :class="{ 'hidden sm:inline': iconOnlyMobile }">
				{{ selectedLabel }}
			</span>
			<Icon
				v-if="iconOnlyMobile"
				name="lucide:filter"
				class="w-4! h-4! text-gray-400 sm:hidden!"
			/>
			<Icon
				name="material-symbols:keyboard-arrow-down-rounded"
				class="w-4! h-4! text-gray-400 transition-transform duration-200"
				:class="{
					'rotate-180': isOpen,
					'hidden! sm:block!': iconOnlyMobile
				}"
			/>
		</button>

		<Transition
			enter-active-class="transition-all duration-300 ease-out overflow-hidden"
			enter-from-class="max-h-0 opacity-0 transform -translate-y-2"
			enter-to-class="max-h-60 opacity-100 transform translate-y-0"
			leave-active-class="transition-all duration-200 ease-in overflow-hidden"
			leave-from-class="max-h-60 opacity-100 transform translate-y-0"
			leave-to-class="max-h-0 opacity-0 transform -translate-y-2"
		>
			<div
				v-if="isOpen"
				class="absolute right-0 sm:left-0 z-50 w-48 sm:w-full mt-2 bg-[#1c1d21] border border-accent/30 rounded-xl overflow-hidden"
			>
				<ul class="max-h-60 overflow-y-auto rounded-t-xl custom-scrollbar">
					<li
						@click="selectOption('')"
						class="px-4 py-2 text-sm font-medium cursor-pointer transition-colors rounded-tl-xl"
						:class="modelValue === '' ? 'bg-accent text-white' : 'text-gray-300 hover:bg-[#2b2d31] hover:text-white'"
					>
						{{ placeholder || 'Toutes les options' }}
					</li>
					<!-- Options dynamiques -->
					<li
						v-for="option in options"
						:key="option.value"
						@click="selectOption(option.value)"
						class="px-4 py-2 text-sm font-medium cursor-pointer transition-colors truncate last:rounded-bl-xl"
						:class="modelValue === option.value ? 'bg-accent text-white' : 'text-gray-300 hover:bg-[#2b2d31] hover:text-white'"
						:title="option.label"
					>
						{{ option.label }}
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
	width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: #5865F2;
	border-radius: 20px;
}
</style>