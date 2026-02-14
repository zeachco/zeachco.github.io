<script lang="ts">
	import { skills } from '$lib/data/skills';
	import type { Role, SkillData } from '$lib/types';
	import { onMount } from 'svelte';
	import { selectedRoles as selectedRolesStore } from '$lib/stores/selectedRoles';
	import { normalizeText } from '$lib/utilities/text';

	// Search aliases mapping
	const searchAliases: Record<string, string[]> = {
		frontend: ['client'],
		backend: ['server'],
		fullstack: ['client', 'server'],
	};

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

	let searchTerm = '';
	let sortedSkills = [...skills];
	let searchInput: HTMLInputElement;
	let totalWithoutSearch = 0;

	function sortSkills() {
		const filteredByRole = [...skills].filter((skill) => calculateCombinedScore(skill) > 0.4);

		totalWithoutSearch = filteredByRole.length;

		sortedSkills = filteredByRole
			.filter((skill) => {
				if (!searchTerm) return true;

				const normalizedSearch = normalizeText(searchTerm);

				// Check if search term is an alias
				if (searchAliases[normalizedSearch]) {
					const targetLabels = searchAliases[normalizedSearch];
					return targetLabels.some((label) => skill.labels?.includes(label));
				}

				// Otherwise, search in name and note
				const normalizedName = normalizeText(skill.name);
				const normalizedNote = skill.note ? normalizeText(skill.note) : '';

				return (
					normalizedName.includes(normalizedSearch) || normalizedNote.includes(normalizedSearch)
				);
			})
			.sort((a, b) => {
				const scoreA = calculateCombinedScore(a);
				const scoreB = calculateCombinedScore(b);
				return scoreB - scoreA;
			});
	}

	onMount(() => {
		sortSkills();
		setTimeout(() => {
			searchInput?.focus();
		}, 100);

		// Listen for global keyboard shortcut
		const handleFocusSearch = () => {
			searchTerm = '';
			setTimeout(() => {
				searchInput?.focus();
			}, 100);
		};

		window.addEventListener('focus-skills-search', handleFocusSearch);

		return () => {
			window.removeEventListener('focus-skills-search', handleFocusSearch);
		};
	});

	$: currentSelectedRoles, searchTerm, sortSkills();

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
		<h3>
			Filter role specific skills
			{#if searchTerm.length > 0}
				<small class="filter-count">{sortedSkills.length}/{totalWithoutSearch}</small>
			{/if}
		</h3>
		<div class="search-box">
			<input
				type="text"
				bind:this={searchInput}
				placeholder="Search skills (try: frontend, backend, fullstack, or any term)..."
				bind:value={searchTerm}
				class="search-input"
			/>
		</div>
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
			<div class="skill-card">
				<div class="flex-grow">
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
	.filter-count {
		margin-left: 0.5rem;
		font-weight: normal;
		opacity: 0.7;
	}
	.selectors {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		grid-gap: 1rem;
		margin-bottom: 2rem;
	}
	.search-input {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.5rem;
		outline: none;
		transition: border-color 0.2s;
	}
	.search-input:focus {
		border-color: #3b82f6;
	}
	.bg-gray-200 {
		text-shadow: none !important;
	}
	.empty {
		margin-bottom: 2em;
		color: brown;
		font-weight: 600;
	}
	.skill-card {
		position: relative;
		display: flex;
		overflow: hidden;
		padding: 1.5rem;
		margin-bottom: 1.5rem;

		/* Apply glass blur effect using CSS variables */
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur-amount)) saturate(var(--glass-saturate));
		-webkit-backdrop-filter: blur(var(--glass-blur-amount)) saturate(var(--glass-saturate));
		border: 2px solid var(--glass-border);
		border-radius: 1rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);

		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		filter: url(#liquid-glass-filter);
	}
	.skill-card:hover {
		transform: perspective(1000px) rotateX(2deg) scale(1.01);
		border-color: rgba(255, 149, 0, 0.5);
		background: rgba(255, 149, 0, 0.08);
		box-shadow: 0 12px 48px rgba(255, 149, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15),
			inset 0 -1px 0 rgba(0, 0, 0, 0.3);
	}
</style>
