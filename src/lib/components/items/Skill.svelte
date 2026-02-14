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
	details {
		position: relative;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		background: rgba(255, 149, 0, 0.05);
		backdrop-filter: blur(6px) saturate(150%);
		-webkit-backdrop-filter: blur(6px) saturate(150%);
		border: 2px solid rgba(255, 149, 0, 0.3);
		border-radius: 1rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: url(#liquid-glass-filter);
	}

	details:hover {
		transform: perspective(1000px) rotateX(2deg) scale(1.01);
		border-color: rgba(255, 149, 0, 0.5);
		background: rgba(255, 149, 0, 0.08);
		box-shadow: 0 12px 48px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3);
	}

	details[open] {
		background: rgba(255, 149, 0, 0.1);
		border-color: rgba(255, 149, 0, 0.6);
		transform: perspective(1000px) scale(1.02);
		box-shadow: 0 16px 64px rgba(255, 149, 0, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.2),
			inset 0 -2px 0 rgba(0, 0, 0, 0.4);
	}

	details[open] summary {
		border-bottom: 1px solid rgba(255, 149, 0, 0.3);
		padding-bottom: 1rem;
		margin-bottom: 1rem;
	}

	summary {
		cursor: pointer;
		list-style: none;
		padding: 0;
		transition: all 0.2s ease;
		position: relative;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary::before {
		content: '▶';
		display: inline-block;
		margin-right: 0.75rem;
		transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		color: var(--pico-primary-background);
		filter: drop-shadow(0 0 4px rgba(255, 149, 0, 0.6));
	}

	summary:hover::before {
		filter: drop-shadow(0 0 8px rgba(255, 149, 0, 0.9));
	}

	details[open] summary::before {
		transform: rotate(90deg);
	}

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
