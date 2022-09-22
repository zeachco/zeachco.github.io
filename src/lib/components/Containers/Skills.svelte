<script lang="ts">
	import SkillComponent from '$lib/components/Skill.svelte';
	import {skills} from '$lib/data/skills'
	import type { PersonalSkill } from '$lib/types';
	import { sortByKey } from '$lib/utilities/date';
    let sortKey: keyof PersonalSkill = 'percent'
    const keys = ['start', 'end', 'percent'] as const
    $: sorted = sortByKey(sortKey, skills)
    const handleChange = (val: any) => {
        sortKey = val.target?.value
    }
    const labels = {
        'start': "Start date",
        'end': "End date",
        'percent': "Confidence",
        'name': "Name",
    }
</script>

<section>
	<h1>Skills</h1>
    <div class="no-print">
        Sort by
        <select value={sortKey} on:change={handleChange}>
            {#each keys as key}
            <option value={key}>{labels[key]}</option>
            {/each}
        </select>
    </div>
    <div class="flex-list">
        {#each sorted as skill}
		<SkillComponent {skill} />
        {/each}
    </div>
</section>

