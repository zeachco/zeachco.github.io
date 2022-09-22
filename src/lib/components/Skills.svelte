<script lang="ts">
	import Skill from '$lib/components/Skill.svelte';
	import {skills} from '$lib/data/skills'
	import { sortByDate } from '$lib/utilities/date';
    const sorted = sortByDate('end', skills)
</script>

<section>
	<h1>Skills</h1>
	{#each sorted as skill}
		<Skill {skill} />
	{/each}
</section>

