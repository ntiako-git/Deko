<script setup lang="ts">
</script>
<template>
	<div class="page-container min-h-screen">
		<AppHeader />

		<OnboardingModal />
		<slot />

		<MobileNav />
	</div>
</template>