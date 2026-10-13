<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useCatalogNavigation } from '~/composables/useCatalogNavigation';

const { sections, activeTab } = useCatalogNavigation();
const activeSection = computed(() => sections.find(s => s.id === activeTab.value) ?? sections[0]);

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const selectSection = (id: string) => {
	activeTab.value = id;
	isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
	if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node))
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
	<nav aria-label="Types d'objets" class="-mx-4 sm:-mx-6 lg:mx-0">
		<!-- Menu de sélection (Mobile) -->
		<div ref="dropdownRef" class="relative lg:hidden px-4 sm:px-6">
			<button
				type="button"
				@click="isOpen = !isOpen"
				aria-haspopup="listbox"
				:aria-expanded="isOpen"
				class="w-full panel flex items-center justify-between h-11 px-3.5 border border-accent/30 text-sm font-medium text-white cursor-pointer outline-none"
			>
				<div class="flex items-center gap-2.5 truncate">
					<Icon :name="activeSection.icon" class="w-4! h-4! text-accent shrink-0" />
					<span class="truncate">{{ activeSection.name }}</span>
				</div>
				<Icon
					name="lucide:chevron-down"
					class="w-4! h-4! text-gray-400 shrink-0 transition-transform duration-300"
					:class="{ 'rotate-180': isOpen }"
				/>
			</button>

			<transition name="custom-dropdown">
				<ul
					v-if="isOpen"
					role="listbox"
					class="absolute z-50 left-4 right-4 sm:left-6 sm:right-6 mt-2 panel border border-accent/30 p-1.5 shadow-2xl overflow-hidden"
				>
					<li v-for="section in sections" :key="section.id" role="option" :aria-selected="activeTab === section.id">
						<button
							type="button"
							@click="selectSection(section.id)"
							class="w-full flex items-center gap-2.5 h-11 px-3.5 rounded-lg text-sm font-medium transition-colors cursor-pointer text-left"
							:class="activeTab === section.id
								? 'bg-accent text-white'
								: 'text-gray-300 hover:bg-white/5 hover:text-white'"
						>
							<Icon
								:name="section.icon"
								class="w-4! h-4! shrink-0"
								:class="activeTab === section.id ? 'text-white' : 'text-accent'"
							/>
							{{ section.name }}
						</button>
					</li>
				</ul>
			</transition>
		</div>

		<!-- Liste Verticale (Desktop) -->
		<ul class="hidden lg:flex flex-col gap-1 overflow-visible">
			<li v-for="section in sections" :key="section.id" class="shrink">
				<button
					type="button"
					@click="activeTab = section.id"
					:aria-current="activeTab === section.id ? 'page' : undefined"
					class="w-full flex items-center gap-2.5 h-11 px-3.5 rounded-xl text-sm font-medium whitespace-nowrap cursor-pointer border transition-colors focus-visible:ring-2 focus-visible:ring-accent/60"
					:class="activeTab === section.id
						? 'bg-accent text-white border-accent shadow-md shadow-accent/25'
						: 'panel text-gray-400 border-transparent hover:text-white hover:border-accent/30 bg-transparent hover:bg-white/5 hover:border-transparent'"
				>
					<Icon :name="section.icon" class="w-4! h-4! shrink-0" />
					{{ section.name }}
				</button>
			</li>
		</ul>
	</nav>
</template>

<style scoped>
.custom-dropdown-enter-active {
	transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
	transform-origin: top;
}

.custom-dropdown-leave-active {
	transition: all 0.18s cubic-bezier(0.5, 0, 1, 1);
	transform-origin: top;
}

.custom-dropdown-enter-from,
.custom-dropdown-leave-to {
	opacity: 0;
	transform: scaleY(0.92) translateY(-4px);
}
</style>