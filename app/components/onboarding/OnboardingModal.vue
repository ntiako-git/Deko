<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PickedItem, UserProfile } from '#shared/profile.ts';
import Modal from '~/components/ui/Modal.vue';
import StepWelcome from './StepWelcome.vue';
import StepDetected from './StepDetected.vue';
import ItemPicker from './ItemPicker.vue';
import StepDone from './StepDone.vue';

const { loggedIn, user, fetch: refreshSession } = useUserSession();

// Le guide s'affiche tant que la session indique `onboarded === false`
const open = ref(false);
watch(
	() => loggedIn.value && user.value?.onboarded === false,
	(shouldOpen) => { if (shouldOpen) open.value = true; },
	{ immediate: true }
);

const STEPS = ['welcome', 'detected', 'effect', 'frame', 'done'] as const;
const stepIndex = ref(0);
const step = computed(() => STEPS[stepIndex.value]!);
const isLast = computed(() => stepIndex.value === STEPS.length - 1);

const { data: profile, status: profileStatus, execute: loadProfile } = useFetch<UserProfile>('/api/me/profile', {
	server: false,
	immediate: false,
	watch: false,
});
watch(open, (isOpen) => { if (isOpen) loadProfile(); }, { immediate: true });

const effect = ref<PickedItem | null>(null);
const frame = ref<PickedItem | null>(null);

const hasAnything = computed(() =>
	!!(profile.value?.avatarDecoration || profile.value?.nameplate || effect.value || frame.value)
);

// Où envoyer l'utilisateur ensuite. Par défaut : l'éditeur.
// Sans aucun objet, l'éditeur serait vide : on suggère plutôt le catalogue.
const suggestion = computed(() => hasAnything.value
	? { to: '/editor', label: 'Ouvrir l\'éditeur', reason: 'Vos objets sont prêts : retrouvez-les dans l\'éditeur pour composer votre profil.' }
	: { to: '/catalog', label: 'Explorer le catalogue', reason: 'Vous n\'avez pas encore d\'objet renseigné : commencez par parcourir le catalogue.' }
);

const saving = ref(false);
const saveError = ref('');

/** Enregistre, ferme le guide, puis redirige si `to` est fourni. Sert aussi à « Passer ». */
async function complete(to?: string) {
	saving.value = true;
	saveError.value = '';
	try {
		await $fetch('/api/me/onboarding', {
			method: 'POST',
			body: {
				profileEffectSkuId: effect.value?.id ?? undefined,
				profileFrameSkuId: frame.value?.id ?? undefined,
			},
		});
		await refreshSession();
		open.value = false;
		if (to) await navigateTo(to);
	} catch {
		saveError.value = 'Enregistrement impossible. Vérifiez votre connexion et réessayez.';
	} finally {
		saving.value = false;
	}
}

const next = () => { if (!isLast.value) stepIndex.value++; };
const back = () => { if (stepIndex.value > 0) stepIndex.value--; };

const skipLabel = computed(() => step.value === 'effect' || step.value === 'frame' ? 'Je n\'en ai pas' : null);
</script>

<template>
	<Modal :open="open" label="Guide de première connexion" :dismissible="false">
		<template #header>
			<div class="flex items-center justify-between gap-3">
				<p class="text-sm text-gray-400 tabular-nums" aria-live="polite">
					Étape {{ stepIndex + 1 }} sur {{ STEPS.length }}
				</p>
				<button
					v-if="!isLast"
					type="button"
					:disabled="saving"
					@click="complete()"
					class="text-sm font-medium text-gray-400 hover:text-white active:text-white transition-colors cursor-pointer disabled:opacity-50"
				>
					Passer le guide
				</button>
			</div>
			<div class="mt-3 flex gap-1.5" aria-hidden="true">
				<span
					v-for="(_, i) in STEPS"
					:key="i"
					class="h-1 flex-1 rounded-full transition-colors duration-300"
					:class="i <= stepIndex ? 'bg-accent' : 'bg-white/10'"
				></span>
			</div>
		</template>

		<StepWelcome v-if="step === 'welcome'" />
		<StepDetected v-else-if="step === 'detected'" :profile="profile ?? null" :loading="profileStatus === 'pending' || profileStatus === 'idle'" />
		<ItemPicker v-else-if="step === 'effect'" v-model="effect" type="effects" />
		<ItemPicker v-else-if="step === 'frame'" v-model="frame" type="frames" />
		<StepDone v-else :profile="profile ?? null" :effect="effect" :frame="frame" :reason="suggestion.reason" />

		<template #footer>
			<p v-if="saveError" class="mb-2 text-sm text-red-400" role="alert">{{ saveError }}</p>

			<div v-if="isLast" class="flex flex-col gap-2">
				<button
					type="button"
					:disabled="saving"
					@click="complete(suggestion.to)"
					class="h-12 rounded-xl bg-accent hover:bg-accent/80 active:scale-[0.98] text-white font-medium text-sm transition-[colors,transform] cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
				>
					<Icon v-if="saving" name="lucide:loader-circle" class="w-4! h-4! animate-spin" />
					{{ suggestion.label }}
				</button>
				<button
					type="button"
					:disabled="saving"
					@click="complete()"
					class="h-11 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
				>
					Rester sur cette page
				</button>
			</div>

			<div v-else class="flex gap-2">
				<button
					v-if="stepIndex > 0"
					type="button"
					@click="back"
					class="h-12 px-5 rounded-xl bg-[#232428] hover:bg-[#2b2d31] text-sm font-medium text-gray-200 transition-colors cursor-pointer"
				>
					Retour
				</button>
				<button
					type="button"
					@click="next"
					class="flex-1 h-12 rounded-xl bg-accent hover:bg-accent/80 active:scale-[0.98] text-white font-medium text-sm transition-[colors,transform] cursor-pointer"
				>
					{{ skipLabel && !(step === 'effect' ? effect : frame) ? skipLabel : 'Continuer' }}
				</button>
			</div>
		</template>
	</Modal>
</template>