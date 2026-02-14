<script lang="ts">
	import { onMount } from 'svelte';

	let isDesktop = false;

	onMount(async () => {
		// Only load animated background on desktop (min-width: 769px)
		const mediaQuery = window.matchMedia('(min-width: 769px)');
		isDesktop = mediaQuery.matches;

		if (isDesktop) {
			// Import the web components from beautiful-backgrounds
			await import('https://esm.sh/beautiful-backgrounds@1.0.0');
		}
	});
</script>

<!-- Only render on desktop -->
{#if isDesktop}
	<bb-ambient-ribbon class="animated-background-2" />
{/if}
<style>
	.animated-background-2 {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		pointer-events: none;
	}
</style>
