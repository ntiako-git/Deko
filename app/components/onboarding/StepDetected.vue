<script setup lang="ts">
import { computed } from 'vue';
import type { UserProfile } from '#shared/profile';

const props = defineProps<{
	profile: UserProfile | null;
	loading: boolean;
}>();

const { user } = useUserSession();

const avatarUrl = computed(() =>
	user.value?.avatar
		? `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png?size=128`
		: null
);
const hasAnything = computed(() => !!(props.profile?.avatarDecoration || props.profile?.nameplate));
</script>

<template>
	<div class="flex flex-col gap-10 md:gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold text-white">Ce que Discord nous a transmis</h2>
			<p class="text-sm text-gray-300">
				Voici les objets équipés sur votre compte au moment de la connexion.
			</p>
		</div>

		<div v-if="loading" class="flex flex-col gap-3" aria-hidden="true">
			<div class="h-28 rounded-xl skeleton-shimmer"></div>
			<div class="h-20 rounded-xl skeleton-shimmer"></div>
		</div>

		<template v-else>
			<!-- Décoration d'avatar -->
			<section class="flex items-center gap-4 rounded-xl bg-[#232428] p-3">
				<div class="relative size-24 shrink-0">
					<img
						:src="avatarUrl ?? 'https://cdn.discordapp.com/embed/avatars/0.png'"
						alt=""
						class="absolute inset-2 size-20 rounded-full object-cover"
					/>
					<img
						v-if="profile?.avatarDecoration"
						:src="`https://cdn.discordapp.com/avatar-decoration-presets/${profile.avatarDecoration.asset}.png`"
						alt="Décoration d'avatar"
						class="absolute inset-0 size-24 object-contain"
					/>
				</div>
				<div class="min-w-0">
					<h3 class="text-sm font-semibold text-white">Décoration d'avatar</h3>
					<p class="text-sm" :class="profile?.avatarDecoration ? 'text-green-400' : 'text-gray-400'">
						{{ profile?.avatarDecoration ? 'Détectée' : 'Aucune détectée' }}
					</p>
				</div>
			</section>

			<!-- Plaque nominative -->
			<section class="flex items-center gap-4 rounded-xl bg-[#232428] p-3">
				<div class="relative size-24 shrink-0">
					<img
						v-if="profile?.nameplate"
						:src="`https://cdn.discordapp.com/assets/collectibles/${profile.nameplate.asset}static.png`"
						:alt="profile.nameplate.label ?? 'Plaque nominative'"
						class="size-20 object-contain"
					/>
					<Icon v-else name="lucide:id-card" class="absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 w-8! h-8! text-white" />
				</div>
				<div class="min-w-0">
					<h3 class="text-sm font-semibold text-white">Plaque nominative</h3>
					<p class="text-sm truncate" :class="profile?.nameplate ? 'text-green-400' : 'text-gray-400'">
						{{ profile?.nameplate ? 'Détectée' : 'Aucune détectée' }}
					</p>
				</div>
			</section>

			<p v-if="!hasAnything" class="text-sm text-gray-400">
				Rien d'équipé ? C'est normal si vous n'avez pas de décoration ni de plaque active sur Discord.
			</p>
		</template>

		<div class="flex gap-3 rounded-xl bg-accent/10 p-3">
			<Icon name="lucide:info" class="w-5! h-5! text-accent shrink-0 mt-0.5" />
			<p class="text-sm text-gray-300">
				Discord ne nous transmet pas encore l'effet de profil ni le cadre de profil.
				Les deux prochaines étapes vous permettent de les indiquer vous-même.
			</p>
		</div>
	</div>
</template>