<script lang="ts">
	import type { SkillData } from '$lib/types';
	import { formatDuration } from '$lib/utilities/date';

	export let small = false;
	export let skill: SkillData;

	$: percent = skill.percent || 0;

	let experienceTime = '';

	if (skill.start && !skill.softskill) {
		const start = new Date(skill.start);
		const end = skill.end ? new Date(skill.end) : new Date();
		const [year, month] = start.toISOString().split('-');
		const duration = formatDuration(start, end);
		experienceTime = `(${year}-${month}) ${duration} of experience`;
	}

	$: hue = Math.round((percent / 100) * 120);
	$: saturation = skill.percent === 0 ? 0 : 50;
	$: style = `
		background-color: hsl(${hue}, ${saturation}%, 50%);
	`;

	let notes = '';
	if (!small && skill.note) {
		notes = skill.note;
	}

	let { name } = skill;

	$: wordLevel = percent >= 90 ? 'expert' : percent >= 70 ? 'proficient' : 'familiar';
	$: wordTooltip = `I consider myself ${wordLevel} in ${name} with a score of ${percent}%`;
</script>

<details>
	<summary>
		<div class="meter no-print" {style} data-glass-tooltip={wordTooltip} data-placement="right" />
		<span>
			{name} <small>{experienceTime}</small>
		</span>
		<small class="print">({wordLevel})</small>
	</summary>
	{#if notes}
		<p>{notes}</p>
	{/if}
</details>

<style>
	.meter {
		display: inline-block;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		margin-right: 0.5rem;
		background-color: #8884;
		box-shadow: inset -3px 0 8px -3px #fff8, -1px 1px 3px -1px #000;
	}
</style>
