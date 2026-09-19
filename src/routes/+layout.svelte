<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$lib/components/containers/Header.svelte';
	import '../app.scss';
	import Contact from '$lib/components/items/Contact.svelte';

	onMount(() => {
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

<iframe
	class="animated-background"
	src="https://www.olivier-rousseau-guyot.com/phantom-game-ai-training/?demo=true&game=circuit#circuit=0"
	title="Cells AI Background"
	loading="lazy"
/>

<Header />

<main class="container">
	<slot />
	<Contact />
</main>

<footer class="no-print">
	<note>
		<!-- <small>This site is automatically kept up-to-date</small> -->
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
