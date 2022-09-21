<script lang="ts">

    // const canvas = document.createElement('canvas')
    // const ctx = canvas.getContext('2d')

    import type {Skill} from "../data/types"

    export let small = false;

    export let skill: Skill;

    function formatDate() {
        if(!skill.since) return ''
        const [year, month] = skill.since.toISOString().split('-')
        return `Since ${year}-${month}`
    }
</script>

<div class="skill">
    <h3>{skill.name} <small>{formatDate()}</small></h3>
    <p>{(small && !skill.note) ? '' : skill.note}</p>
</div>

<style>
div {
    display: inline-block;
    max-width: 400px;
}
</style>
