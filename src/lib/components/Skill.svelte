<script lang="ts">
	import type { PersonalSkill } from '$lib/types';
	import Label from './Label.svelte';
	import Meter from './Meter.svelte';

	export let small = false;
	export let skill: PersonalSkill;

	$: percent = skill.percent || 0;

	let experienceTime = '';

	if (skill.start) {
		const start = new Date(skill.start);
		const end = skill.end ? new Date(skill.end) : new Date();
		const [year, month] = start.toISOString().split('-');
		const [yearNow] = end.toISOString().split('-');
		const diff = +yearNow - +year;
		experienceTime = `(${year}-${month}) ${diff} years of experience`;
	}

	let notes = '';
	if (!small && skill.note) {
		notes = skill.note;
	}

	const labels = skill.labels || [];
</script>

<div class="card">
	{#if percent}
		<Meter {percent} />
	{/if}
	<h3>{skill.name} <small>{experienceTime}</small></h3>
	<div class="labels no-print">
		{#each labels as label}
			<Label name={label} />
		{/each}
	</div>
	<p>{notes}</p>
</div>
