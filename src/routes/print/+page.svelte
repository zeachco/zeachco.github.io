<script lang="ts">
	import Contact from '$lib/components/Items/Contact.svelte';
	import Companies from '$lib/components/Containers/Companies.svelte';
	import Skills from '$lib/components/Containers/Skills.svelte';
	import Trainings from '$lib/components/Containers/Trainings.svelte';
	import { onMount } from 'svelte';

	let printDisclaimer: HTMLDivElement

	// let the canvases render
	onMount(async () => setTimeout(() => {
		printDisclaimer.style.display = 'none'
		print()
	}, 1500));
</script>

<svelte:head>
	<title>Printable CV</title>
	<meta name="description" content="Printable CV" />
</svelte:head>

<div class="no-print" bind:this={printDisclaimer}>Waiting for the page to render correctly...</div>
<Contact />
<Companies />
<Skills />
<Trainings />
