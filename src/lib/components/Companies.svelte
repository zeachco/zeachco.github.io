<script lang="ts">
	import {companies} from '$lib/data/companies'
	import { sortByDate } from '$lib/utilities/date';
	import Company from './Company.svelte';

	const comps = sortByDate('start', companies)
</script>

<section>
	<h1>Work Experiences</h1>
	{#each comps as company}
		<Company {company} />
	{/each}
</section>
