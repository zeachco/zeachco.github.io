<script lang="ts">
    import Speedometer from "svelte-speedometer"

    export let percent = 0;
</script>

<div>

<!-- <Speedometer minValue={0} maxValue={100} value={percent} /> -->
</div>

<style>
	div {
		float: right;
        /* background: black; */
        width: 64px;
        height: 16px;
        transform: scale(.25);
	}
</style>
