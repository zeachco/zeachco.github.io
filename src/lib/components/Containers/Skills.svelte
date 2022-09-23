<script lang="ts">
	import SkillComponent from '$lib/components/Items/Skill.svelte';
	import { flip } from 'svelte/animate';
	import { skills } from '$lib/data/skills';
	import { sortByKey } from '$lib/utilities/date';
	import type { SkillData } from '$lib/types';

	const keys = ['start', 'end', 'percent'] as const;
	$: sortKey = 'percent' as keyof SkillData;
	$: sorted = sortByKey(sortKey, skills);
	$: handleChange = (val: any) => (sortKey = val.target?.value);

	const labels = {
		start: 'Start date',
		end: 'End date',
		percent: 'Confidence',
		name: 'Name',
	};
</script>

<section>
	<h1>Skills</h1>
	<div class="no-print">
		Sort by
		<select value={sortKey} on:change={handleChange}>
			{#each keys as key, i (key)}
				<option id={i + ''} animate:flip value={key}>{labels[key]}</option>
			{/each}
		</select>
	</div>
	<div class="flex-list">
		{#each sorted as skill, i (skill)}
			<div>
				<SkillComponent {skill} />
			</div>
		{/each}
	</div>
</section>
