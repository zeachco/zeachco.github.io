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
	summary {
		align-items: center;
	}

	.meter {
		display: inline-block;
		width: 1.15rem;
		height: 1.15rem;
		border-radius: 50%;
		flex-shrink: 0;
		background-color: #8884;
		box-shadow: inset -2px -2px 5px rgba(0, 0, 0, 0.4), inset 2px 2px 4px rgba(255, 255, 255, 0.25);
	}
</style>
