<script lang="ts">
	import { page } from '$app/stores';

	const labels = {
		'/companies': 'Companies',
		'/skills': 'Skills',
		'/trainings': 'Trainings',
		'/print': '🖨️',
	} as const;

	type Label = keyof typeof labels;
	const links = Object.keys(labels) as Label[];
</script>

<nav class="container-fluid" data-theme="light">
	<ul>
		<li>
			<strong>
				<a href="/">Olivier Rousseau</a>
			</strong>
		</li>
	</ul>
	<ul class="no-print">
		{#each links as link}
			<li class:active={$page.url.pathname === link}>
				<a href={link}>{labels[link]}</a>
			</li>
		{/each}
	</ul>
</nav>
