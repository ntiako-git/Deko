<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isScrolled = ref(false);
const isVisible = ref(true);
let lastScrollY = 0;

const handleScroll = () => {
	const currentScrollY = window.scrollY;

	// Devient flottant après un petit scroll
	isScrolled.value = currentScrollY > 30;

	// Masquer / Afficher selon la direction du scroll (seulement après 100px)
	if (currentScrollY > 100)
		isVisible.value = currentScrollY <= lastScrollY;
	else
		isVisible.value = true;

	lastScrollY = currentScrollY;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});

const navLinks = [
	{ name: 'Catalogue', path: '/catalog', icon: 'lucide:newspaper' },
	{ name: 'Éditeur', path: '/editor', icon: 'lucide:wand-sparkles' },
	{ name: 'Galerie', path: '/gallery', icon: 'lucide:image' },
	{ name: 'Comparer', path: '/compare', icon: 'lucide:git-compare' },
];
</script>

<template>
	<header
		class="fixed top-0 left-0 right-0 z-50 transition-transform duration-300 px-4 sm:px-6 py-4"
		:class="[
			isVisible ? 'translate-y-0' : '-translate-y-full',
			isScrolled ? 'py-3' : 'py-5'
		]"
	>
		<div
			class="max-w-6xl mx-auto flex justify-between items-center border transition-all duration-300"
			:class="isScrolled ? 'bg-[#111214]/90 backdrop-blur-lg px-6 py-3 rounded-2xl border-accent/30' : 'bg-transparent border-transparent'"
		>
			<!-- Logo -->
			<NuxtLink to="/" class="text-heading tracking-wide">Deko</NuxtLink>

			<!-- Navigation Desktop (Cachée sur mobile) -->
			<nav class="hidden md:flex items-center gap-6">
				<NuxtLink
					v-for="link in navLinks"
					:key="link.path"
					:to="link.path"
					class="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors py-2.5 px-3 rounded-lg hover:bg-[#232428]"
					active-class="text-white bg-[#232428]"
				>
					<Icon :name="link.icon" class="w-5! h-5!" />
					{{ link.name }}
				</NuxtLink>
			</nav>

			<!-- CTA -->
			<button class="discord-btn bg-accent hover:bg-accent/80 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-[colors,transform] cursor-pointer shadow-md">
				<Icon name="simple-icons:discord" class="discord-icon w-5! h-5!" />
				<span class="hidden sm:inline">Connexion Discord</span>
				<span class="sm:hidden">Connexion</span>
			</button>
		</div>
	</header>

	<div class="h-20"></div>
</template>