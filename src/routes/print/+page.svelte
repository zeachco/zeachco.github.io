<script lang="ts">
	import Contact from '$lib/components-case-fix/items/Contact.svelte';
	import Companies from '$lib/components-case-fix/containers/Companies.svelte';
	import Skills from '$lib/components-case-fix/containers/Skills.svelte';
	import Trainings from '$lib/components-case-fix/containers/Trainings.svelte';
	import { onMount } from 'svelte';
	import { PAGE_TRANSITION_TIME } from '$lib/utilities/constants';

	let printDisclaimer: HTMLDivElement;

	// let the canvases render
	onMount(async () =>
		setTimeout(() => {
			printDisclaimer.style.display = 'none';
			print();
		}, PAGE_TRANSITION_TIME + 1),
	);
</script>

<svelte:head>
	<title>Printable CV</title>
	<meta name="description" content="Printable CV" />
</svelte:head>

<div class="no-print" bind:this={printDisclaimer}>
	<progress />
	Waiting for the page to render correctly...
</div>

<div class="pagebreak">
	<Contact />
</div>
<div class="pagebreak">
	<Companies />
</div>
<div class="pagebreak">
	<Skills />
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
