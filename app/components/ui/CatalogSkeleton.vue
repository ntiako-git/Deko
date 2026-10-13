<template>
	<div class="flex flex-col gap-10" aria-hidden="true">
		<div v-for="catIndex in 2" :key="catIndex" class="flex flex-col gap-4">
			<!-- Bannière -->
			<div class="w-full h-32 sm:h-40 md:h-48 rounded-2xl skeleton-shimmer"></div>

			<!-- Titre -->
			<div class="h-7 w-44 rounded-xl skeleton-shimmer"></div>

			<!-- Grille -->
			<div class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
				<div
					v-for="cardIndex in (catIndex === 1 ? 6 : 3)"
					:key="cardIndex"
					class="panel p-2 flex flex-col gap-3 skeleton-shimmer"
				>
					<div class="w-full h-40 rounded-lg bg-white/5"></div>
					<div class="flex flex-col gap-2 px-1.5 pb-1.5">
						<div class="h-4 w-4/5 rounded bg-white/5"></div>
						<div class="h-3 w-1/3 rounded bg-white/5"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>