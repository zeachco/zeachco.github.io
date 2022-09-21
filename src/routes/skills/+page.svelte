<script lang="ts">
	import Skill from '$lib/components/Skill.svelte';
	import {skills} from '../../lib/data/data'
	let sorted = skills.sort((a, b) => +b.start - +a.start)
</script>

<svelte:head>
	<title>Skills</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Skills</h1>
	{#each sorted as skill}
		<Skill {skill} />
	{/each}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
