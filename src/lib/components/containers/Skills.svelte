<script lang="ts">
	import { skills } from '$lib/data/skills';
	import type { Role, SkillData } from '$lib/types';
	import { onMount } from 'svelte';
	import { selectedRoles as selectedRolesStore } from '$lib/stores/selectedRoles';

	const howMuchTimeElapsed = (date: string | Date, endDate?: string | Date) => {
		const currentDate = new Date();
		const startDate = new Date(date);
		const endDateValue = endDate ? new Date(endDate) : currentDate;
		const elapsedMonths =
			(endDateValue.getFullYear() - startDate.getFullYear()) * 12 +
			(endDateValue.getMonth() - startDate.getMonth());
		if (elapsedMonths >= 12) {
			const elapsedYears = Math.floor(elapsedMonths / 12);
			return `${elapsedYears} ${elapsedYears === 1 ? 'year' : 'years'}`;
		} else {
			return `${elapsedMonths} ${elapsedMonths === 1 ? 'month' : 'months'}`;
		}
	};

	// Add prop for external control (used by print route)
	// If provided, use it instead of the store
	export let selectedRoles: Role[] | undefined = undefined;

	// Use store if no external value provided
	let currentSelectedRoles: Role[];
	$: currentSelectedRoles = selectedRoles ?? $selectedRolesStore;

	let sortedSkills = [...skills];

	function sortSkills() {
		sortedSkills = [...skills]
			.filter((skill) => calculateCombinedScore(skill) > 0.4)
			.sort((a, b) => {
				const scoreA = calculateCombinedScore(a);
				const scoreB = calculateCombinedScore(b);
				return scoreB - scoreA;
			});
	}

	onMount(() => {
		sortSkills();
	});

	$: currentSelectedRoles, sortSkills();

	function calculateCombinedScore(skill: SkillData) {
		if (!currentSelectedRoles.length) return 0;
		return (
			currentSelectedRoles.reduce((sum, role) => sum + skill.score[role], 0) /
			currentSelectedRoles.length
		);
	}

	function enumarate(items: string[]) {
		const comaSeparated = items.slice(0, -1).join(', ');
		const lastItem = items.slice(-1);
		return comaSeparated + (items.length > 1 ? ' and ' : '') + lastItem;
	}
</script>

<div class="container mx-auto px-4">
	<div class="print" />
	<div class="no-print">
		<h3>Select role specific skills</h3>
		<div class="selectors">
			{#each Object.keys(skills[0].score) as role}
				<label class="inline-flex items-center cursor-pointer" style="max-width:200px">
					<input
						type="checkbox"
						name="sortCriteria"
						value={role}
						bind:group={$selectedRolesStore}
						disabled={selectedRoles !== undefined}
					/>
					<span class="ml-2">{role}</span>
				</label>
			{/each}
		</div>
	</div>
	{#if currentSelectedRoles.length > 0}
		<h4>Relevant skills for {enumarate(currentSelectedRoles)}:</h4>
	{:else}
		<div class="empty">Select at lease one role</div>
	{/if}

	<div class="space-y-4">
		{#each sortedSkills as skill}
			<div class="shadow-lg rounded-lg overflow-hidden flex">
				<div class="px-4 py-2 flex-grow">
					<div class="w-full flex gap-4">
						<h3 class="text-lg font-semibold">
							{skill.name}
							{#if !skill.softskill}
								<small class="text-sm text-gray-600">
									{howMuchTimeElapsed(skill.start, skill.end)} of experience
								</small>
							{/if}
						</h3>
					</div>

					<p class="text-sm mb-2">{skill.note ?? ''}</p>

					<div class="flex flex-wrap gap-1 no-print">
						{#each skill.labels ?? '' as label}
							<span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
								{label}
							</span>
						{/each}
					</div>
					<div class="text-right">
						<i class="text-xs opacity-50">
							Relevance: {(calculateCombinedScore(skill) * 100).toFixed(1)}%
						</i>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	h3 {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
	.selectors {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-gap: 1rem;
		margin-bottom: 2rem;
	}
	.bg-gray-200 {
		text-shadow: none !important;
	}
	.empty {
		margin-bottom: 2em;
		color: brown;
		font-weight: 600;
	}
</style>
