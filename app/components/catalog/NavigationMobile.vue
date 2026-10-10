<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCatalogNavigation } from '~/composables/useCatalogNavigation';

const { sections, activeTab } = useCatalogNavigation();
const isOpen = ref(false);
const containerRef = ref<HTMLElement | null>(null);

const activeSection = computed(() =>
	sections.find(s => s.id === activeTab.value) || sections[0]
);

const selectSection = (id: string) => {
	activeTab.value = id;
	isOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
	if (containerRef.value && !containerRef.value.contains(e.target as Node))
		isOpen.value = false;
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
	<div class="relative md:hidden w-full" ref="containerRef">
		<button
			@click="isOpen = !isOpen"
			type="button"
			class="w-full panel p-2.5 flex items-center justify-between border border-accent/30 text-white font-medium text-sm cursor-pointer shadow-md"
			:class="{ 'border-accent bg-[#232428]': isOpen }"
		>
			<div class="flex items-center gap-2">
				<Icon :name="activeSection.icon" class="w-4! h-4! text-accent" />
				<span>{{ activeSection.name }}</span>
			</div>
			<Icon
				name="material-symbols:keyboard-arrow-down-rounded"
				class="w-4! h-4! text-gray-400 transition-transform duration-200"
				:class="{ 'rotate-180': isOpen }"
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
				class="absolute top-full left-0 right-0 z-50 mt-2 bg-[#1c1d21] border border-accent/30 rounded-xl overflow-hidden"
			>
				<ul>
					<li
						v-for="section in sections"
						:key="section.id"
						@click="selectSection(section.id)"
						class="px-4 py-2.5 text-sm cursor-pointer flex items-center gap-2 transition-colors first:rounded-t-xl last:rounded-b-xl"
						:class="activeTab === section.id ? 'bg-accent text-white font-medium' : 'text-gray-300 hover:bg-[#2b2d31] hover:text-white'"
					>
						<Icon :name="section.icon" class="w-4! h-4!" :class="activeTab === section.id ? 'text-white' : 'text-accent'" />
						{{ section.name }}
					</li>
				</ul>
			</div>
		</Transition>
	</div>
</template>