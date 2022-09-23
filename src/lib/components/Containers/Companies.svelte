<script lang="ts">
	import { companies } from '$lib/data/companies';
	import type { CompanyData } from '$lib/types';
	import { sortByKey } from '$lib/utilities/date';
	import Company from '../Items/Company.svelte';

	const comps: CompanyData[] = sortByKey('start', companies);
</script>

<section>
	<h1>Work Experiences</h1>
	<div class="flex-list">
		{#each comps as company}
			<Company {company} />
		{/each}
	</div>
</section>
