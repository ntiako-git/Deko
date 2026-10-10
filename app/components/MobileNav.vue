<script setup lang="ts">
const navLinks = [
	{ name: 'Catalogue', path: '/catalog', icon: 'lucide:newspaper' },
	{ name: 'Éditeur', path: '/editor', icon: 'lucide:wand-sparkles' },
	{ name: 'Galerie', path: '/gallery', icon: 'lucide:image' },
	{ name: 'Comparer', path: '/compare', icon: 'lucide:git-compare' },
];
</script>

<template>
	<nav class="fixed bottom-0 left-0 right-0 z-50 bg-[#111214]/90 backdrop-blur-lg border-t border-[#5865F2]/30 px-4 py-2.5 md:hidden">
		<div class="flex justify-around items-center max-w-md mx-auto">
			<NuxtLink
				v-for="link in navLinks"
				:key="link.path"
				:to="link.path"
				class="flex items-center gap-2 py-2.5 px-3 text-xs font-medium text-gray-400 transition-colors rounded-xl"
				active-class="text-white bg-[#232428]"
			>
				<Icon :name="link.icon" class="w-5! h-5!" />
				<span>{{ link.name }}</span>
			</NuxtLink>
		</div>
	</nav>
</template>