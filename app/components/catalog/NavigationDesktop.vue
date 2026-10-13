<script setup lang="ts">
import { useCatalogNavigation } from '~/composables/useCatalogNavigation';

const { sections, activeTab } = useCatalogNavigation();
</script>

<template>
	<div class="hidden md:block relative mt-4">
		<div class="overflow-x-auto no-scrollbar flex items-center gap-2 pb-2 relative pr-10">
			<button
				v-for="section in sections"
				:key="section.id"
				@click="activeTab = section.id"
				class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-pointer border"
				:class="activeTab === section.id
					? 'bg-accent text-white border-accent shadow-md'
					: 'panel text-gray-400 hover:text-white border-transparent hover:border-accent/30'"
			>
				<Icon :name="section.icon" class="w-4 h-4" />
				{{ section.name }}
			</button>
		</div>
	</div>
</template>