<script lang="ts">
	import {companies} from '$lib/data/companies'
	import { sortByKey } from '$lib/utilities/date';
	import Company from '../Company.svelte';

	const comps = sortByKey('start', companies)
</script>

<section>
	<h1>Work Experiences</h1>
	<div class="flex-list">
		{#each comps as company}
		<Company {company} />
		{/each}
	</div>
</section>
