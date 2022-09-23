<script lang="ts">
	import Contact from '$lib/components/Contact.svelte';
	import Companies from '$lib/components/Containers/Companies.svelte';
	import Skills from '$lib/components/Containers/Skills.svelte';
</script>

<svelte:head>
	<title>Printable CV</title>
	<meta name="description" content="Printable CV" />
</svelte:head>

<Contact />
<Companies />
<Skills />

