<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
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
		backgroundOn,
		initBackgroundOn,
		toggleBackgroundOn,
	} from '$lib/stores/phantomGame';
	import type { VisitorSim } from '$lib/sim';

	// How long the background fades to zero before the iframe is removed.
	// Keep in sync with $game-hover-fade in app.scss.
	const BACKGROUND_FADE_MS = 2000;

	let backgroundMounted = true;
	let backgroundFading = false;
	let fadeToken = 0;

	function handleBackgroundCycle() {
		switchPhantomGame();
	}

	function handleBackgroundToggle() {
		fadeToken++;
		if ($backgroundOn) {
			// Off: fade the alpha away, then remove the iframe.
			backgroundFading = true;
			const token = fadeToken;
			setTimeout(() => {
				if (token !== fadeToken) return;
				backgroundFading = false;
				backgroundMounted = false;
			}, BACKGROUND_FADE_MS + 50);
		} else {
			// On: put the iframe back. Its carousel restarts from zero opacity,
			// so it fades itself back in.
			backgroundFading = false;
			backgroundMounted = true;
		}
		toggleBackgroundOn();
	}

	onMount(() => {
		initPhantomGame();
		initBackgroundOn();
		// A background saved off must not mount its iframe at all.
		if (!get(backgroundOn)) backgroundMounted = false;

		// The visitor simulation is its own module: load it after hydration so
		// it stays a separate chunk, never runs on the server, and only starts
		// watching once the page is actually up.
		let sim: VisitorSim | null = null;
		let simRenderer: (() => void) | undefined;
		let unsubscribePage: (() => void) | undefined;
		let simDisposed = false;
		import('$lib/sim').then((simModule) => {
			if (simDisposed) return;
			sim = simModule.initVisitorSim();
			unsubscribePage = page.subscribe(({ url }) => sim?.navigate(url.pathname));
			// the network renderer is a dev-only extra, localhost only
			const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
			if (isLocal) {
				simRenderer = simModule.initSimRenderer(sim, document.body);
			}
		});

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
			simDisposed = true;
			simRenderer?.();
			simRenderer = undefined;
			unsubscribePage?.();
			sim?.dispose();
			sim = null;
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

{#if $phantomGame && backgroundMounted}
	{#key $phantomGame}
		<iframe
			class="animated-background"
			class:is-off={backgroundFading}
			src={phantomGameBackgroundUrl($phantomGame)}
			title="Phantom AI experiment background"
			loading="lazy"
			on:animationend={handleBackgroundCycle}
		/>
	{/key}
{/if}

<Header onToggleBackground={handleBackgroundToggle} />

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
