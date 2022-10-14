<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Containers/Header.svelte';
	import Background from '$lib/components/Background/Background.svelte';
</script>

<Header />

<main>
	<slot />
</main>

<Background />

<footer class="no-print">
	<p>This site is auto-generated</p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		/* max-width: 1024px; */
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
