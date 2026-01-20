<script lang="ts">
	export let name: string;
	export let svg: string;
	export let background = 'transparent';
	const padding = background === 'transparent' ? '0' : '1em';
</script>

<div class="brand" aria-describedby={name}>
	<img style="background-color: {background}; padding: {padding}" src={svg} alt="{name} logo" />
	<div role="tooltip" id={name}>{name}</div>
</div>

<style>
	.brand {
		opacity: 0.5;
		cursor: pointer;
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

	[role='tooltip'] {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(-0.5rem);
		background: black;
		color: white;
		padding: 0.5rem;
		border-radius: 0.25rem;
		white-space: nowrap;
		z-index: 1;
		margin-top: 0.25rem;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.15s ease-out,
			transform 0.15s ease-out,
			visibility 0.15s;
	}

	.brand:hover [role='tooltip'],
	.brand:focus-within [role='tooltip'] {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(0);
	}
</style>
