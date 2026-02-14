<script lang="ts">
	import { onMount } from 'svelte';

	onMount(async () => {
		// Import the web components from beautiful-backgrounds
		await import('https://esm.sh/beautiful-backgrounds@1.0.0');
	});
</script>

<!-- Use the BbAmbientRibbon web component -->
<bb-ambient-ribbon class="animated-background-2" />

<!-- /> -->
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
