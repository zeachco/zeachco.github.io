<script lang="ts">
	import { skills } from '$lib/data/skills';
	import type { Role, SkillData } from '$lib/types';
	import { onMount } from 'svelte';
	import { selectedRoles as selectedRolesStore } from '$lib/stores/selectedRoles';
	import { normalizeText } from '$lib/utilities/text';
	import { PAGE_TRANSITION_TIME } from '$lib/utilities/constants';

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
		}, PAGE_TRANSITION_TIME);

		// Listen for global keyboard shortcut
		const handleFocusSearch = () => {
			searchTerm = '';
			setTimeout(() => {
				searchInput?.focus();
			}, PAGE_TRANSITION_TIME);
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

	// role keys typed once so the template stays cast-free
	const roleKeys = Object.keys(skills[0].score) as Role[];

	function enumarate(items: string[]) {
		const comaSeparated = items.slice(0, -1).join(', ');
		const lastItem = items.slice(-1);
		return comaSeparated + (items.length > 1 ? ' and ' : '') + lastItem;
	}
</script>

<div class="skills-page">
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
			/>
		</div>
		<div class="selectors">
			{#each roleKeys as role}
				<label
					class="role-chip"
					class:active={$selectedRolesStore.includes(role)}
					class:locked={selectedRoles !== undefined}
				>
					<input
						type="checkbox"
						name="sortCriteria"
						value={role}
						bind:group={$selectedRolesStore}
						disabled={selectedRoles !== undefined}
					/>
					{role}
				</label>
			{/each}
		</div>
	</div>
	{#if currentSelectedRoles.length > 0}
		<h4>Relevant skills for {enumarate(currentSelectedRoles)}:</h4>
	{:else}
		<div class="empty">Select at least one role</div>
	{/if}

	<div class="skill-list">
		{#each sortedSkills as skill}
			<div class="skill-card">
				<div class="skill-top">
					<h3 class="skill-name">{skill.name}</h3>
					<small class="skill-relevance no-print">
						Relevance {(calculateCombinedScore(skill) * 100).toFixed(1)}%
					</small>
				</div>
				{#if !skill.softskill}
					<small class="skill-duration">
						{howMuchTimeElapsed(skill.start, skill.end)} of experience
					</small>
				{/if}
				{#if skill.note}
					<p class="skill-note">{skill.note}</p>
				{/if}
				{#if skill.labels}
					<div class="skill-labels no-print">
						{#each skill.labels as label}
							<span>{label}</span>
						{/each}
					</div>
				{/if}
				<span
					class="relevance-bar no-print"
					style="width: {calculateCombinedScore(skill) * 100}%"
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.filter-count {
		margin-left: 0.5rem;
		font-weight: 400;
		font-size: 0.78rem;
		opacity: 0.75;
		vertical-align: middle;
	}

	.search-box {
		margin: 1.25rem 0 1rem;
	}

	.search-box input {
		width: 100%;
		padding: 0.8rem 1rem;
		font-size: 0.95rem;
		font-family: inherit;
		background: #12100d;
		border: 1px solid var(--line);
		border-radius: 10px;
		color: var(--text);
		outline: none;
		transition: border-color 0.2s ease, box-shadow 0.2s ease;
	}

	.search-box input::placeholder {
		color: var(--text-3);
	}

	.search-box input:focus {
		border-color: var(--accent-line);
		box-shadow: 0 0 0 3px rgba(229, 155, 61, 0.14);
	}

	.selectors {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.role-chip {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 0.45em 1.05em;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 500;
		letter-spacing: 0.01em;
		color: var(--text-2);
		cursor: pointer;
		user-select: none;
		transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
	}

	.role-chip input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	.role-chip:hover {
		border-color: var(--line-2);
		color: var(--text);
	}

	.role-chip.active {
		color: var(--accent);
		border-color: var(--accent-line);
		background: var(--accent-soft);
	}

	.role-chip.locked {
		opacity: 0.55;
		cursor: default;
	}

	.empty {
		margin-bottom: 2em;
		padding: 2.25rem 1rem;
		text-align: center;
		color: var(--text-2);
		font-weight: 500;
		border: 1px dashed var(--line-2);
		border-radius: var(--radius-card);
		background: rgba(232, 224, 208, 0.02);
	}

	.skill-list {
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
	}

	.skill-card {
		position: relative;
		overflow: hidden;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius-card);
		padding: 1.15rem 1.25rem 1.35rem;
		transition: border-color 0.2s ease, background 0.2s ease;
	}

	.skill-card:hover {
		border-color: var(--line-2);
		background: var(--surface-2);
	}

	.skill-top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
	}

	.skill-name {
		font-family: 'DM Sans', system-ui, sans-serif;
		font-size: 1.02rem;
		font-weight: 600;
		color: var(--text);
		margin: 0;
		letter-spacing: 0.01em;
	}

	.skill-relevance {
		font-size: 0.72rem;
		color: var(--text-3);
		white-space: nowrap;
	}

	.skill-duration {
		display: block;
		margin-top: 0.2rem;
		font-size: 0.72rem;
		letter-spacing: 0.02em;
	}

	.skill-note {
		margin: 0.55rem 0 0;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	.skill-labels {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-top: 0.7rem;
	}

	.skill-labels span {
		font-size: 0.7rem;
		font-weight: 500;
		letter-spacing: 0.03em;
		color: var(--text-2);
		background: rgba(232, 224, 208, 0.06);
		border: 1px solid var(--line);
		border-radius: 999px;
		padding: 0.22rem 0.65rem;
	}

	.relevance-bar {
		position: absolute;
		left: 0;
		bottom: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--accent), var(--accent-2));
		opacity: 0.85;
	}

	@media print {
		.skill-card {
			padding: 0.4rem 0;
			border: none;
			border-bottom: 1px solid #ddd;
		}

		.skill-top {
			display: block;
		}

		.skill-note {
			color: #333;
		}

		.skill-labels {
			margin-top: 0.25rem;
		}

		.skill-labels span {
			border: none;
			background: none;
			color: #555;
		}
	}
</style>
