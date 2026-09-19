<script lang="ts">
	export let name: string;
	export let svg: string;
	export let background = 'transparent';
	const padding = background === 'transparent' ? '0.4em 0.9em' : '0.6em 1em';
</script>

<div class="brand" data-glass-tooltip={name} data-placement="bottom">
	<img style="background-color: {background}; padding: {padding}" src={svg} alt="{name} logo" />
</div>

<style>
	.brand {
		position: relative;
		opacity: 0.55;
		transition: opacity 0.2s ease, transform 0.2s ease;
	}

	.brand:hover,
	.brand:focus-within {
		opacity: 1;
		transform: translateY(-2px);
	}

	img {
		max-height: 2.8em;
		max-width: 10em;
		display: inline-block;
		object-fit: contain;
		border-radius: 0.7rem;
		border: 1px solid var(--line);
		background: transparent;
		box-shadow: none;
		transition: border-color 0.2s ease;
	}

	.brand:hover img {
		border-color: var(--line-2);
	}
</style>
