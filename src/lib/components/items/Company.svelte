<script lang="ts">
	import type { CompanyData } from '$lib/types';
	import Label from '../micro/Label.svelte';

	export let small = false;
	export let open = false;

	export let company: CompanyData;

	let experienceTime = '';

	if (company.start) {
		const start = new Date(company.start);
		const end = company.end ? new Date(company.end) : new Date();
		const [year, month] = start.toISOString().split('-');
		const [yearEnd, monthEnd] = end.toISOString().split('-');
		const diff = (+yearEnd + +monthEnd / 12 - (+year + +month / 12)).toFixed(1);
		experienceTime = `${year}-${month} to ${yearEnd}-${monthEnd} (${diff} years)`;
	}

	let notes = '';
	if (!small && company.note) {
		notes = company.note;
	}

	const labels = company.labels || [];
</script>

<details {open}>
	<summary>{company.name} <small>{experienceTime}</small></summary>
	<span class="labels no-print">
		{#each labels as label}
			<Label name={label} />
		{/each}
	</span>
	{#if notes}
		<p>{notes}</p>
	{/if}
</details>
