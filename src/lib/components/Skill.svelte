<script lang="ts">
	import type { PersonalSkill } from '$lib/types';
	import Companies from './Containers/Companies.svelte';
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
	let {name} = skill

	$: innerWidth = 0
</script>

<svelte:window bind:innerWidth  />

<div class="card">
	{#if percent && innerWidth>768}
		<Meter {...{percent, name}} />
	{/if}
	<h2>{name} <small>{experienceTime}</small></h2>
	<div class="labels no-print">
		{#each labels as label}
			<Label name={label} />
		{/each}
	</div>
	<p>{notes}</p>
</div>
