<script lang="ts">
	import '../app.scss';
	import Header from '$lib/components/containers/Header.svelte';
</script>

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
