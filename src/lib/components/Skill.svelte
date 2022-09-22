<script lang="ts">
	import type { Company, Skill } from '../types';
	import Label from './Label.svelte';
	import Meter from './Meter.svelte';

	export let small = false;

	export let skill: Skill;

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

    const percent:number = skill.percent || 0

	const labels = skill.labels || [];
</script>

<div class="skill">
	{#if percent}
		<Meter percent={percent} />
	{/if}
	<h3>{skill.name} <small>{experienceTime}</small></h3>
	<div class="labels no-print">
		{#each labels as label}
			<Label name={label} />
		{/each}
	</div>
	<p>{notes}</p>
</div>

<style>
	div {
		display: inline-block;
	}

	.labels {
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	small {
		color: gray;
	}
</style>
