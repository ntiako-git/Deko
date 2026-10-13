<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<{
	/** Nom accessible de la boîte de dialogue */
	label: string;
	/** Fermeture par clic sur le fond ou Échap */
	dismissible?: boolean;
}>(), { dismissible: true });

const emit = defineEmits<{ close: [] }>();
const open = defineModel<boolean>('open', { default: false });

const panel = ref<HTMLElement | null>(null);
let previouslyFocused: HTMLElement | null = null;

watch(open, (isOpen) => {
	if (!import.meta.client) return;
	document.body.style.overflow = isOpen ? 'hidden' : '';
	if (isOpen) previouslyFocused = document.activeElement as HTMLElement | null;
	else previouslyFocused?.focus?.();
}, { immediate: true });

onUnmounted(() => {
	if (import.meta.client) document.body.style.overflow = '';
});

const focusPanel = () => nextTick(() => panel.value?.focus());

const onKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Escape' && props.dismissible) {
		emit('close');
		return;
	}
	if (e.key !== 'Tab' || !panel.value) return;

	// Piège à focus : Tab reste dans la modale
	const focusables = panel.value.querySelectorAll<HTMLElement>(
		'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
	);
	if (!focusables.length) return;
	const first = focusables[0]!;
	const last = focusables[focusables.length - 1]!;

	if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.value)) {
		e.preventDefault();
		last.focus();
	} else if (!e.shiftKey && document.activeElement === last) {
		e.preventDefault();
		first.focus();
	}
};
</script>

<template>
	<ClientOnly>
		<Teleport to="body">
			<Transition name="modal" @after-enter="focusPanel">
				<div
					v-if="open"
					class="fixed inset-0 z-60 flex items-end md:items-center justify-center"
					@keydown="onKeydown"
				>
					<div class="absolute inset-0 bg-black/70" @click="dismissible && emit('close')"></div>

					<!-- Feuille plein format (Mobile) -->
					<!-- Boîte centrée (Desktop) -->
					<div
						ref="panel"
						tabindex="-1"
						role="dialog"
						aria-modal="true"
						:aria-label="label"
						class="modal-panel relative flex flex-col w-full h-full md:h-auto md:max-h-[85dvh] md:max-w-lg bg-[#1c1d21] md:rounded-2xl border border-transparent md:border-accent/30 overflow-hidden"
					>
						<header v-if="$slots.header" class="shrink-0 px-4 py-4 sm:px-6">
							<slot name="header" />
						</header>

						<div class="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 sm:px-6 py-2">
							<slot />
						</div>

						<footer v-if="$slots.footer" class="shrink-0 px-4 sm:px-6 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
							<slot name="footer" />
						</footer>
					</div>
				</div>
			</Transition>
		</Teleport>
	</ClientOnly>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
	transition: opacity 0.2s ease;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
	transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.modal-enter-from,
.modal-leave-to {
	opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
	transform: translateY(100%);
}
@media (min-width: 768px) {
	.modal-enter-from .modal-panel,
	.modal-leave-to .modal-panel {
		transform: translateY(1rem) scale(0.98);
	}
}
@media (prefers-reduced-motion: reduce) {
	.modal-enter-active,
	.modal-leave-active,
	.modal-enter-active .modal-panel,
	.modal-leave-active .modal-panel {
		transition: none;
	}
}
</style>