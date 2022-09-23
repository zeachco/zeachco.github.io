<script lang="ts">
	import { page } from '$app/stores';
	import Contact from './Contact.svelte';

	const labels = {
		'/': 'All',
		'/skills': 'Skills',
		// '/projects': 'Projects',
		'/companies': 'Companies',
		// '/hobbies': 'Hobbies'
	} as const;

	type Label = keyof typeof labels;
	const links = Object.keys(labels) as Label[];
</script>

<header class="no-print">
	<nav data-sveltekit-prefetch>
		<ul>
			{#each links as link}
				<li class:active={$page.url.pathname === link}>
					<a href={link}>{labels[link]}</a>
				</li>
			{/each}
		</ul>
		<Contact />
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		margin: auto;
	}

	nav {
		display: flex;
		justify-content: space-between;
		/* justify-content: center; */
		--background: rgba(255, 255, 255, 0.7);
		width: 100%;
		/* background: blue; */
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
		border-bottom-right-radius: .5em;
		margin-right: .25em;
	}

	li {
		position: relative;
		height: 100%;
	}

	li.active::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--accent-color);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 1em;
		color: var(--heading-color);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--accent-color);
	}
</style>
