<script lang="ts">
	import { page } from '$app/stores';

	const labels = {
		'/': 'About',
		'/companies': 'Companies',
		'/trainings': 'trainings',
		'/skills': 'Skills',
		'/print': '🖨️',
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
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		margin: auto;
		--background: rgba(255, 255, 255, 0.7);
		background: var(--background);
		background-size: contain;
	}

	nav {
		margin: auto;
	}

	ul {
		margin: auto;
		display: flex;
		justify-content: center;
		justify-content: space-between;
		position: relative;
		padding: 0;
		height: 3em;
		align-items: center;
		list-style: none;
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
