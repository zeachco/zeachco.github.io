<script lang="ts">
	import type { Company } from '../types';
	import Label from './Label.svelte';

	export let small = false;

	export let company: Company;

	let experienceTime = '';

	if (company.start) {
		const start = new Date(company.start);
		const end = company.end ? new Date(company.end) : new Date();
		const [year, month] = start.toISOString().split('-');
		const [yearEnd, monthEnd] = end.toISOString().split('-');
		const diff = ((+yearEnd+ +monthEnd/12) - (+year + +month/12)).toFixed(1);
		experienceTime = `${year}-${month} to ${yearEnd}-${monthEnd} (${diff} years)`;
	}

	let notes = '';
	if (!small && company.note) {
		notes = company.note;
	}

	const labels = company.labels || [];
</script>

<div class="card">
	<h3>{company.name} <small>{experienceTime}</small></h3>
	<span class="labels no-print">
		{#each labels as label}
			<Label name={label} />
		{/each}
	</span>
	<p>{notes}</p>
</div>
