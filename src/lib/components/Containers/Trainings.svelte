<script lang="ts">
	import { sortByKey } from '$lib/utilities/date';
	import { trainings } from '$lib/data/trainings';
	import type { SkillData } from '$lib/types';
	import Training from '../Items/Training.svelte';
	$: sorted = sortByKey('start', trainings) as SkillData[];
</script>

<section>
	<h1>Trainings</h1>
	<div class="flex-list">
		{#each sorted as training, i (training)}
			<Training {training} />
		{/each}
	</div>
</section>
