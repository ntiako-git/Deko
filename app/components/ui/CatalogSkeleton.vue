<template>
	<div class="flex flex-col gap-10 mt-6">
		<div v-for="catIndex in 2" :key="catIndex" class="flex flex-col gap-6">
			<!-- Bannière Squelette -->
			<div class="w-full h-40 md:h-48 rounded-2xl skeleton-shimmer"></div>

			<!-- Titre Squelette -->
			<div class="h-8 w-48 rounded-xl skeleton-shimmer"></div>

			<!-- Grille de Cartes Squelette -->
			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				<div
					v-for="cardIndex in (catIndex === 1 ? 4 : 3)"
					:key="cardIndex"
					class="panel p-4 flex flex-col gap-4 h-52 skeleton-shimmer"
				>
					<!-- Zone image -->
					<div class="w-full h-28 rounded-lg bg-white/5 mx-auto"></div>
					<!-- Lignes de texte -->
					<div class="flex flex-col gap-2 mt-auto">
						<div class="h-4 w-4/5 rounded bg-white/5"></div>
						<div class="h-3 w-1/3 rounded bg-white/5"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>