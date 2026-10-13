<script setup lang="ts">
import { computed } from 'vue';
import type { PickedItem, UserProfile } from '#shared/profile';

const props = defineProps<{
	profile: UserProfile | null;
	effect: PickedItem | null;
	frame: PickedItem | null;
	reason: string;
}>();

const rows = computed(() => [
	{ label: 'Décoration d\'avatar', value: props.profile?.avatarDecoration ? 'Détectée' : null },
	{ label: 'Plaque nominative', value: props.profile?.nameplate ? (props.profile.nameplate.label ?? 'Détectée') : null },
	{ label: 'Effet de profil', value: props.effect?.name ?? null },
	{ label: 'Cadre de profil', value: props.frame?.name ?? null },
]);
</script>

<template>
	<div class="flex flex-col gap-10 md:gap-5">
		<div class="flex flex-col gap-2">
			<h2 class="text-xl font-bold text-white">Tout est prêt</h2>
			<p class="text-sm text-gray-300">{{ reason }}</p>
		</div>

		<ul class="flex flex-col rounded-xl bg-[#232428] divide-y divide-white/5">
			<li v-for="row in rows" :key="row.label" class="flex items-center gap-3 px-3 min-h-12">
				<Icon
					:name="row.value ? 'lucide:circle-check' : 'lucide:circle-dashed'"
					class="w-4! h-4! shrink-0"
					:class="row.value ? 'text-green-400' : 'text-gray-600'"
				/>
				<span class="text-sm text-gray-300">{{ row.label }}</span>
				<span class="ml-auto text-sm truncate max-w-[50%]" :class="row.value ? 'text-white font-medium' : 'text-gray-500'">
					{{ row.value ?? 'Non renseigné' }}
				</span>
			</li>
		</ul>
	</div>
</template>