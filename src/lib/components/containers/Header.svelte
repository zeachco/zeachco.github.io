<script lang="ts">
	import { page } from '$app/stores';

	const labels = {
		'/companies': ['Companies'],
		'/skills': ['Skills'],
		'/trainings': ['Trainings'],
		'/print': ['🖨️', 'Printable CV'],
	} as const;

	type Label = keyof typeof labels;
	const links = Object.keys(labels) as Label[];
</script>

<nav class="container">
	<ul>
		<li>
			<strong>
				<a href="/" class:active={$page.url.pathname === '/'}>Olivier Rousseau</a>
			</strong>
		</li>
	</ul>
	<ul class="no-print">
		{#each links as link}
			<li>
				<a
					class:active={$page.url.pathname === link}
					data-placement="left"
					data-tooltip={labels[link][1]}
					href={link}>{labels[link][0]}</a
				>
			</li>
		{/each}
	</ul>
</nav>

<style>
	nav ul {
		gap: 0.5rem;
	}
</style>
