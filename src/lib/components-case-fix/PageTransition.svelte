<script lang="ts">
	import { fly } from 'svelte/transition';
	export let pathname: string;
</script>

{#key pathname}
	<div in:fly={{ y: -60, duration: 250, delay: 250 }} out:fly={{ x: 5, duration: 250 }}>
		<slot />
	</div>
{/key}
