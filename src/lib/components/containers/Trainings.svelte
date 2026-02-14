<script lang="ts">
	import { sortByKey } from '$lib/utilities/date';
	import { trainings } from '$lib/data/trainings';
	import type { SkillData } from '$lib/types';
	import Training from '../items/Training.svelte';
	import PageTransition from '../PageTransition.svelte';
	$: sorted = sortByKey('start', trainings) as SkillData[];
</script>

<section>
	<PageTransition pathname="training">
		<h1>Trainings</h1>
		<div class="flex-list">
			{#each sorted as training (training)}
				<Training {training} />
			{/each}
		</div>
	</PageTransition>
</section>
