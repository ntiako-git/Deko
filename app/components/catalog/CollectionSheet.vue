<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';
import CollectionPicker from './CollectionPicker.vue';

defineProps<{
	options: { id: string; name: string; count: number }[];
	loading?: boolean;
	resultCount: number;
}>();

const open = defineModel<boolean>('open', { default: false });
const selected = defineModel<string[]>('selected', { default: () => [] });

watch(open, (isOpen) => {
	if (import.meta.client) document.body.style.overflow = isOpen ? 'hidden' : '';
});

const onKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Escape') open.value = false;
};

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
	window.removeEventListener('keydown', onKeydown);
	document.body.style.overflow = '';
});
</script>

<template>
	<ClientOnly>
		<Teleport to="body">
			<Transition name="sheet">
				<div v-if="open" class="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Choisir des collections">
					<div class="absolute inset-0 bg-black/60" @click="open = false"></div>

					<div class="sheet-panel absolute inset-x-0 bottom-0 h-[80dvh] flex flex-col bg-[#1c1d21] rounded-t-2xl">
						<span class="absolute left-1/2 -translate-x-1/2 top-2 w-10 h-1 rounded-full bg-white/15"></span>

						<div class="flex items-center justify-between px-4 pt-6 pb-2">
							<span class="text-heading text-lg">Filtre des collections</span>
							<button
								type="button"
								@click="open = false"
								aria-label="Fermer"
								class="size-9 rounded-xl text-gray-300 flex items-center justify-center"
							>
								<Icon name="lucide:x" class="w-4! h-4!" />
							</button>
						</div>

						<CollectionPicker
							v-model="selected"
							:options="options"
							:loading="loading"
							class="flex-1 px-4 pt-2"
						/>

						<div class="p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
							<button
								type="button"
								@click="open = false"
								class="w-full h-12 rounded-xl bg-accent hover:bg-accent/80 active:scale-[0.98] text-white font-medium text-sm shadow-md shadow-accent/25 transition-[colors,transform] cursor-pointer"
							>
								Afficher {{ resultCount }} {{ resultCount > 1 ? 'objets' : 'objet' }}
							</button>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</ClientOnly>
</template>

<style scoped>
.sheet-enter-active,
.sheet-leave-active {
	transition: opacity 0.2s ease;
}
.sheet-enter-active .sheet-panel,
.sheet-leave-active .sheet-panel {
	transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
	opacity: 0;
}
.sheet-enter-from .sheet-panel,
.sheet-leave-to .sheet-panel {
	transform: translateY(100%);
}
@media (prefers-reduced-motion: reduce) {
	.sheet-enter-active,
	.sheet-leave-active,
	.sheet-enter-active .sheet-panel,
	.sheet-leave-active .sheet-panel {
		transition: none;
	}
}
</style>