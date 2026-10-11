<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const { loggedIn, user, clear } = useUserSession();

const isScrolled = ref(false);
const isVisible = ref(true);
let lastScrollY = 0;
const isMenuOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

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

const handleClickOutside = (e: MouseEvent) => {
	if (menuRef.value && !menuRef.value.contains(e.target as Node))
		isMenuOpen.value = false;
};

const handleLogout = async () => {
	await clear();
	isMenuOpen.value = false;
	navigateTo('/');
};

const navLinks = [
	{ name: 'Catalogue', path: '/catalog', icon: 'lucide:newspaper' },
	{ name: 'Éditeur', path: '/editor', icon: 'lucide:wand-sparkles' },
	{ name: 'Galerie', path: '/gallery', icon: 'lucide:image' },
	{ name: 'Comparer', path: '/compare', icon: 'lucide:git-compare' },
];

onMounted(() => {
	window.addEventListener('scroll', handleScroll, { passive: true });
	document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
	document.removeEventListener('click', handleClickOutside);
});
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
			<div v-if="loggedIn && user" class="relative" ref="menuRef">
				<button
					@click="isMenuOpen = !isMenuOpen"
					class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#232428] transition-colors cursor-pointer"
				>
					<img
						v-if="user.avatar"
						:src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`"
						:alt="`${user.username}'s avatar`"
						class="w-5 h-5 rounded-full object-cover ring-2 ring-accent/40"
					/>
					<div v-else class="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
						{{ user.username?.charAt(0).toUpperCase() }}
					</div>
					<span class="text-white font-semibold text-sm tracking-wide">{{ user.username }}</span>
					<Icon
						name="lucide:chevron-down"
						class="w-4! h-4! text-gray-400 transition-transform duration-200"
						:class="{ 'rotate-180': isMenuOpen }"
					/>
				</button>

				<Transition
					enter-active-class="transition duration-150 ease-out"
					enter-from-class="transform scale-95 opacity-0"
					enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-100 ease-in"
					leave-from-class="transform scale-100 opacity-100"
					leave-to-class="transform scale-95 opacity-0"
				>
					<div
						v-if="isMenuOpen"
						class="absolute right-0 mt-2 w-48 bg-[#1c1d21] border border-accent/30 rounded-xl shadow-md overflow-hidden z-50"
					>
						<NuxtLink
							to="/"
							@click="isMenuOpen = false"
							class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2b2d31] hover:text-white transition-colors"
						>
							<Icon name="lucide:settings" class="w-4! h-4! text-accent" />
							Settings
						</NuxtLink>
						<div class="h-px bg-gray-800 my-1"></div>
						<button
							@click="handleLogout"
							class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer text-left"
						>
							<Icon name="lucide:log-out" class="w-4! h-4!" />
							Déconnexion
						</button>
					</div>
				</Transition>
			</div>
			<template v-else>
				<a href="/auth/discord" class="discord-btn bg-accent hover:bg-accent/80 text-white px-4 py-2.5 rounded-md font-medium text-sm flex items-center gap-2 transition-[colors,transform] cursor-pointer shadow-md">
					<Icon name="simple-icons:discord" class="discord-icon w-5! h-5!" />
					<span class="hidden sm:inline">Connexion Discord</span>
					<span class="sm:hidden">Connexion</span>
				</a>
			</template>
		</div>
	</header>

	<div class="h-20"></div>
</template>