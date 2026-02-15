<script lang="ts">
	import { PAGE_TRANSITION_TIME } from '$lib/utilities/constants';
	import { fly } from 'svelte/transition';
	export let pathname: string;
</script>

{#key pathname}
	<div
		in:fly={{ y: -60, duration: PAGE_TRANSITION_TIME, delay: 0 }}
		out:fly={{ x: 5, duration: PAGE_TRANSITION_TIME / 2, delay: 0 }}
	>
		<slot />
	</div>
{/key}
