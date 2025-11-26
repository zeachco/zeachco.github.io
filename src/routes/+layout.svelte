<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/components/containers/Header.svelte';
	import '../app.scss';

	onMount(() => {
		const handleMouseMove = (e: MouseEvent) => {
			const x = (e.clientX / window.innerWidth) * 100;
			const y = (e.clientY / window.innerHeight) * 100;

			// Calculate rotation based on mouse position (-10deg to +10deg)
			const rotation = ((x - 50) / 50) * 10;

			// Calculate scale based on distance from center (1.0 to 1.15)
			const centerX = 50;
			const centerY = 50;
			const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
			const maxDistance = Math.sqrt(50 * 50 + 50 * 50);
			const scale = 1 + (distance / maxDistance) * 0.15;

			document.documentElement.style.setProperty('--mouse-x', `${x}%`);
			document.documentElement.style.setProperty('--mouse-y', `${y}%`);
			document.documentElement.style.setProperty('--mouse-rotate', `${rotation}deg`);
			document.documentElement.style.setProperty('--mouse-scale', `${scale}`);
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<iframe
	class="animated-background"
	src="https://zeachco.github.io/cells-ai?demo=true"
	title="Cells AI Background"
	loading="lazy"
/>

<Header />

<main class="container">
	<slot />
</main>

<footer class="no-print">
	<note>
		<small>This site and it's cv is automatically kept up-to-date</small>
	</note>
</footer>

<style>
	* {
		text-shadow: 0 0px 3px black, 0 0 1px black;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
