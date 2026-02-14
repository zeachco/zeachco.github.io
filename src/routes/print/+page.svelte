<script lang="ts">
	import Contact from '$lib/components/items/Contact.svelte';
	import Companies from '$lib/components/containers/Companies.svelte';
	import Skills from '$lib/components/containers/Skills.svelte';
	import Trainings from '$lib/components/containers/Trainings.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { PAGE_TRANSITION_TIME } from '$lib/utilities/constants';

	import type { Role } from '$lib/types';

	let printDisclaimer: HTMLDivElement;
	let selectedRoles: Role[] = [];
	let isHeadless = false;

	// Parse roles from URL: ?roles=frontend,backend&headless=true
	// Only access searchParams in the browser to avoid prerender issues
	$: if (browser) {
		const rolesParam = $page.url.searchParams.get('roles');
		selectedRoles = rolesParam ? (rolesParam.split(',') as Role[]) : [];
		isHeadless = $page.url.searchParams.get('headless') === 'true';
	}

	// let the canvases render
	onMount(async () =>
		setTimeout(() => {
			printDisclaimer.style.display = 'none';
			// Don't call print() in headless mode (Puppeteer will handle PDF generation)
			if (!isHeadless) {
				print();
			}
		}, PAGE_TRANSITION_TIME + 1),
	);
</script>

<svelte:head>
	<title>Printable CV</title>
	<meta name="description" content="Printable CV" />
</svelte:head>

<div class="pagebreak">
	<Contact />
</div>
<div class="pagebreak">
	<Companies />
</div>
<div class="pagebreak">
	<Skills {selectedRoles} />
</div>
<div class="pagebreak">
	<Trainings />
</div>

<style>
	@media print {
		.pagebreak {
			page-break-after: auto;
		}
	}
</style>
