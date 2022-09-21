<script lang="ts">
	// const canvas = document.createElement('canvas')
	// const ctx = canvas.getContext('2d')

	import type { Skill } from '../data/types';

	export let small = false;

	export let skill: Skill;

	let experienceTime = '';

	if (skill.start) {
		const [year, month] = skill.start.toISOString().split('-');
		const until = skill.end || new Date();
		const [yearNow, monthNow] = until.toISOString().split('-');
		const diff = +yearNow - +year;
		experienceTime = `${diff} years of experience`;
	}

	let notes = '';
	if (!small && skill.note) {
		notes = skill.note;
	}
</script>

<div class="skill">
	<h3>{skill.name} <small>{experienceTime}</small></h3>
	<p>{notes}</p>
</div>

<style>
	div {
		display: inline-block;
		max-width: 400px;
	}

	small {
		color: gray;
	}
</style>
