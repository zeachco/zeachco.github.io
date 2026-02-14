<script lang="ts">
	export let name: string;
	export let svg: string;
	export let background = 'transparent';
	const padding = background === 'transparent' ? '0' : '1em';
</script>

<div class="brand" data-glass-tooltip={name} data-placement="bottom">
	<img style="background-color: {background}; padding: {padding}" src={svg} alt="{name} logo" />
</div>

<style>
	.brand {
		opacity: 0.5;
		position: relative;
		transition: opacity 0.15s ease-out;
	}

	.brand:hover,
	.brand:focus-within {
		opacity: 1;
	}

	img {
		max-height: 4em;
		max-width: 12em;
		display: inline-block;
		border-radius: 1em;
		background: #fff;
		padding: 0.5em;
		box-shadow: inset 0 0 5px 0px #888, 0 0 2px black;
	}
</style>
