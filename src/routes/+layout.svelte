<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/containers/Header.svelte';
	import '../app.scss';
	import Contact from '$lib/components/items/Contact.svelte';
	import {
		phantomGame,
		initPhantomGame,
		phantomGameBackgroundUrl,
		switchPhantomGame,
	} from '$lib/stores/phantomGame';

	function handleBackgroundCycle() {
		switchPhantomGame();
	}

	onMount(() => {
		initPhantomGame();

		const handleKeyDown = (e: KeyboardEvent) => {
			// Check for Ctrl+K (Windows/Linux) or Cmd+K (Mac)
			if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
				e.preventDefault();

				// Check if we're already on the skills page
				if ($page.url.pathname === '/skills') {
					// Dispatch custom event to focus and clear the search field
					window.dispatchEvent(new CustomEvent('focus-skills-search'));
				} else {
					// Navigate to skills page
					goto('/skills');
				}
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<svelte:head>
	<link rel="canonical" href={`https://www.olivier-rousseau-guyot.com${$page.url.pathname}`} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Olivier Rousseau-Guyot" />
	<meta property="og:image" content="https://www.olivier-rousseau-guyot.com/og-image.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Olivier Rousseau-Guyot, Software Engineer — 20+ years shipping payments, games, and the infrastructure in between"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://www.olivier-rousseau-guyot.com/og-image.png" />
</svelte:head>

{#if $phantomGame}
	{#key $phantomGame}
		<iframe
			class="animated-background"
			src={phantomGameBackgroundUrl($phantomGame)}
			title="Phantom AI experiment background"
			loading="lazy"
			on:animationend={handleBackgroundCycle}
		/>
	{/key}
{/if}

<Header />

<main class="container">
	<slot />
	<Contact />
</main>

<footer class="no-print">
	<note>
		<small>This site is automatically kept up-to-date</small>
	</note>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
		padding: 2.75rem 1.25rem 1.5rem;
		max-width: 76rem;
	}

	@media print {
		main {
			padding: 0;
			width: fit-content;
			max-width: none;
		}
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
