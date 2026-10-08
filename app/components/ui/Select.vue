<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type Option = {
	value: string;
	label: string;
};

const props = defineProps<{
	options: Option[];
	placeholder?: string;
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

onMounted(() => {
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
	<div class="relative w-48" ref="selectContainer">
		<!-- Bouton principal -->
		<button
			@click="toggleOpen"
			type="button"
			class="w-full bg-[#232428] hover:bg-[#2b2d31] text-gray-300 text-sm py-2 px-4 rounded-lg flex items-center justify-between transition-colors border border-transparent focus:border-gray-600 focus:outline-none"
			:class="{ 'bg-[#2b2d31]': isOpen }"
		>
			<span class="truncate pr-2">{{ selectedLabel }}</span>
			<Icon
				name="material-symbols:keyboard-arrow-down-rounded"
				class="w-5 h-5 text-gray-400 transition-transform duration-200"
				:class="{ 'rotate-180': isOpen }"
			/>
		</button>

		<!-- Liste déroulante -->
		<Transition
			enter-active-class="transition duration-100 ease-out"
			enter-from-class="transform scale-95 opacity-0"
			enter-to-class="transform scale-100 opacity-100"
			leave-active-class="transition duration-75 ease-in"
			leave-from-class="transform scale-100 opacity-100"
			leave-to-class="transform scale-95 opacity-0"
		>
			<div
				v-if="isOpen"
				class="absolute z-50 w-full mt-2 bg-[#1c1d21] border border-gray-800 rounded-lg shadow-xl overflow-hidden"
			>
				<ul class="max-h-60 overflow-y-auto py-1 custom-scrollbar">
					<!-- Option par défaut (Toutes) -->
					<li
						@click="selectOption('')"
						class="px-4 py-2 text-sm cursor-pointer transition-colors"
						:class="modelValue === '' ? 'bg-[#5865F2] text-white' : 'text-gray-300 hover:bg-[#2b2d31] hover:text-white'"
					>
						{{ placeholder || 'Toutes les options' }}
					</li>
					<!-- Options dynamiques -->
					<li
						v-for="option in options"
						:key="option.value"
						@click="selectOption(option.value)"
						class="px-4 py-2 text-sm cursor-pointer transition-colors truncate"
						:class="modelValue === option.value ? 'bg-[#5865F2] text-white' : 'text-gray-300 hover:bg-[#2b2d31] hover:text-white'"
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
/* Scrollbar personnalisée pour la liste */
.custom-scrollbar::-webkit-scrollbar {
	width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
	background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
	background-color: #3f4147;
	border-radius: 20px;
}
</style>