<script lang="ts">
	import type { TrainingData } from '$lib/types';

	export let small = false;

	export let training: TrainingData;

	let experienceTime = '';

	if (training.start) {
		const until = new Date(training.end || training.start || Date.now());
		const start = new Date(training.start);
		const [year, month] = start.toISOString().split('-');
		try {
			const [yearEnd, monthEnd] = until.toISOString().split('-');
			const diff = ((+yearEnd+ +monthEnd/12) - (+year + +month/12)).toFixed(1);
			experienceTime = `${year}-${month} to ${yearEnd}-${monthEnd} (${diff} years)`;
		} catch (err) {

			console.error(err, {training});
		}
	}

	let notes = '';
	if (!small && training.note) {
		notes = training.note;
	}
</script>

<div class="card">
	<h2>{training.name} <small>{experienceTime}</small></h2>
	<p>{notes}</p>
</div>
