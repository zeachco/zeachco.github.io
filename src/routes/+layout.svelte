<script lang="ts">
	import '@picocss/pico';
	import '../app.css';
	import Header from '$lib/components/Containers/Header.svelte';
</script>

<Header />

<main class="container">
	<slot />
</main>

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
