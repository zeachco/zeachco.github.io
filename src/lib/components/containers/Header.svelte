<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { roles } from '$lib/types';
	import { selectedRoles } from '$lib/stores/selectedRoles';

	const staticLabels = {
		'/companies': ['Companies'],
		'/skills': ['Skills'],
		'/trainings': ['Trainings'],
	} as const;

	let showDropdown = false;
	let useMarkdown = false;

	// Calculate download variant based on selected roles
	$: downloadVariant =
		$selectedRoles.length > 0 && $selectedRoles.length < roles.length
			? [...$selectedRoles].sort().join('-')
			: 'all';

	$: downloadUrl = useMarkdown
		? `/skills/olivier-rousseau_${downloadVariant}.md`
		: `/skills/olivier-rousseau_${downloadVariant}.pdf`;

	function toggleDropdown(e: MouseEvent) {
		e.preventDefault();
		showDropdown = !showDropdown;
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.cv-dropdown-container')) {
			showDropdown = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<nav class="container">
	<ul>
		<li>
			<strong>
				<a href="/" class:active={$page.url.pathname === '/'}>Olivier</a>
			</strong>
		</li>
	</ul>
	<ul class="no-print">
		{#each Object.entries(staticLabels) as [link, labels]}
			<li>
				<a class:active={$page.url.pathname === link} href={link}>
					{labels[0]}
				</a>
			</li>
		{/each}
		{#if browser}
			<li class="cv-dropdown-container">
				<a
					href={downloadUrl}
					on:click={toggleDropdown}
					data-glass-tooltip="Download CV"
					data-placement="left"
				>
					📥 CV
				</a>
				{#if showDropdown}
					<div class="cv-dropdown">
						<div class="dropdown-section">
							<strong>Format:</strong>
							<label>
								<input type="radio" name="format" bind:group={useMarkdown} value={false} />
								PDF
							</label>
							<label>
								<input type="radio" name="format" bind:group={useMarkdown} value={true} />
								Markdown
							</label>
						</div>
						<div class="dropdown-section">
							<strong>Roles:</strong>
							{#each roles as role}
								<label>
									<input type="checkbox" name="roles" value={role} bind:group={$selectedRoles} />
									{role}
								</label>
							{/each}
						</div>
						<div class="dropdown-actions">
							<a href={downloadUrl} class="download-btn">Download</a>
						</div>
					</div>
				{/if}
			</li>
		{/if}
	</ul>
</nav>

<style>
	nav ul {
		gap: 0.5rem;
	}

	.cv-dropdown-container {
		position: relative;
	}

	.cv-dropdown {
		position: absolute;
		top: 100%;
		right: 0;
		margin-top: 0.5rem;

		/* Apply glass blur effect */
		background: var(--glass-bg);
		backdrop-filter: blur(var(--glass-blur-amount)) saturate(var(--glass-saturate));
		-webkit-backdrop-filter: blur(var(--glass-blur-amount)) saturate(var(--glass-saturate));
		border: 2px solid var(--glass-border);
		border-radius: 1rem;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.3),
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2);

		padding: 1rem;
		min-width: 200px;
		z-index: 1000;
	}

	.dropdown-section {
		margin-bottom: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.dropdown-section strong {
		display: block;
		margin-bottom: 0.25rem;
		font-size: 0.875rem;
	}

	.dropdown-section label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		font-size: 0.875rem;
		margin: 0;
	}

	.dropdown-section input[type='checkbox'],
	.dropdown-section input[type='radio'] {
		margin: 0;
		/* width: auto; */
	}

	.dropdown-actions {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--pico-border-color);
	}

	.download-btn {
		display: block;
		width: 100%;
		text-align: center;
		padding: 0.5rem;
		background: var(--pico-primary);
		color: #fff;
		border-radius: var(--pico-border-radius);
		text-decoration: none;
		font-weight: 600;
	}

	.download-btn:hover {
		background: var(--pico-primary-hover);
	}
</style>
