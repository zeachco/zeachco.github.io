<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	const staticLabels = {
		'/about': ['About'],
		'/companies': ['Companies'],
		'/skills': ['Skills'],
		'/trainings': ['Trainings'],
	} as const;

	let downloadVariant = 'all';

	// Update variant when localStorage changes
	function updateVariant() {
		if (!browser) return;
		const stored = localStorage.getItem('selectedRoles');
		const roles: string[] = stored ? JSON.parse(stored) : [];
		downloadVariant = roles.length > 0 ? roles.sort().join('-') : 'all';
	}

	onMount(() => {
		updateVariant();
		// Listen for storage changes
		window.addEventListener('storage', updateVariant);
		return () => window.removeEventListener('storage', updateVariant);
	});

	$: if (browser) updateVariant(); // Reactive update

	$: pdfUrl = `/skills/olivier-rousseau_${downloadVariant}.pdf`;
	$: mdUrl = `/skills/olivier-rousseau_${downloadVariant}.md`;
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
		{#each Object.keys(staticLabels) as link}
			<li>
				<a class:active={$page.url.pathname === link} href={link}>
					{staticLabels[link][0]}
				</a>
			</li>
		{/each}
		{#if browser}
			<li>
				<a
					href={pdfUrl}
					data-as-markdown={mdUrl}
					data-tooltip="Download CV as PDF"
					data-placement="left"
				>
					📥 PDF
				</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav ul {
		gap: 0.5rem;
	}
</style>
