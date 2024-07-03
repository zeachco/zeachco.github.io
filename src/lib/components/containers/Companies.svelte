<script lang="ts">
	import { companies } from '$lib/data/companies';
	import type { CompanyData } from '$lib/types';
	import { sortByKey } from '$lib/utilities/date';
	import Company from '../items/Company.svelte';
	import PageTransition from '../PageTransition.svelte';
	import { browser } from '$app/environment';

	const comps: CompanyData[] = sortByKey('start', companies);
	const showAll = !browser || window.location.pathname.includes('print');
</script>

<section>
	<PageTransition pathname="work">
		<h1>Work Experiences</h1>
		<div class="flex-list">
			{#each comps as company}
				<Company {company} open={comps.indexOf(company) === 0 || showAll} />
			{/each}
		</div>
	</PageTransition>
</section>
