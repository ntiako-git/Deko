<script setup lang="ts">
const features = [
	{ icon: 'lucide:newspaper', name: 'Catalogue', text: 'Parcourez tous les objets par collection, avec leurs prix.' },
	{ icon: 'lucide:wand-sparkles', name: 'Éditeur', text: 'Composez votre profil et visualisez le rendu avant d\'acheter.' },
	{ icon: 'lucide:image', name: 'Galerie', text: 'Découvrez les compositions des autres utilisateurs.' },
	{ icon: 'lucide:columns-2', name: 'Comparateur', text: 'Comparez plusieurs objets côte à côte.' },
];
</script>

<template>
	<div class="flex flex-col gap-10 md:gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold text-white">Bienvenue sur <span class="text-accent">Deko</span></h2>
			<p class="text-sm text-gray-300">
				Deko vous aide à explorer et à essayer les objets de collection Discord : décorations d'avatar,
				effets de profil, plaques nominatives et cadres de profil.
			</p>
		</div>

		<div class="flex items-center gap-3 rounded-xl bg-accent/10 p-3">
			<Icon name="lucide:info" class="w-5! h-5! text-accent shrink-0" />
			<p class="text-sm text-gray-300">
				Deko est un site indépendant, non affilié à Discord. Les achats se font toujours directement dans Discord.
			</p>
		</div>

		<ul class="flex flex-col gap-5">
			<li v-for="feature in features" :key="feature.name" class="flex items-center gap-3">
				<span class="size-9 shrink-0 rounded-lg bg-[#232428] flex items-center justify-center">
					<Icon :name="feature.icon" class="w-4! h-4! text-accent" />
				</span>
				<div class="min-w-0">
					<h3 class="text-sm font-semibold text-white">{{ feature.name }}</h3>
					<p class="text-sm text-gray-400">{{ feature.text }}</p>
				</div>
			</li>
		</ul>

		<p class="text-sm text-gray-400">
			Pour vous éviter de tout renseigner à la main, les prochaines étapes récupèrent ce que vous avez déjà équipé sur Discord.
		</p>
	</div>
</template>