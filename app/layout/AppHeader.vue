<template>
	<header class="flex justify-between items-center py-6">
		<div class="text-2xl font-bold text-white tracking-wide">Deko</div>

		<nav class="flex items-center gap-8">
			<NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white transition-base font-medium">
				<Icon name="lucide:house" class="w-5 h-5" />
				Home
			</NuxtLink>
			<NuxtLink to="/catalog" class="flex items-center gap-2 text-white font-medium">
				<Icon name="lucide:newspaper" class="w-5 h-5" />
				Catalogue
			</NuxtLink>
		</nav>

		<button class="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-base">
			<Icon name="simple-icons:discord" class="w-4 h-4" />
			Login with Discord
		</button>
	</header>
</template>