<script lang="ts">
	import { startAnimation, stopAnimation } from '$lib/utilities/canvas';
	import { viewport } from '$lib/utilities/viewport';

	export let percent = 0;
	export let name = 'unknown';

	let context: CanvasRenderingContext2D;

	$: value = percent / 100;
	$: step = 0;
	$: animate = false;
	$: draw = (ctx: CanvasRenderingContext2D) => {
		context = ctx;
		const diff = value - step;
		step += diff / 20;

		ctx.setLineDash([]);
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, 64, 64);
		ctx.beginPath();
		ctx.setLineDash([3, 1]);
		ctx.strokeStyle = `hsl(${step * 90}, 50%, 50%)`;
		ctx.lineWidth = 10;
		ctx.arc(32, 32, 25, Math.PI * 0.5 + Math.PI * -step, Math.PI * 0.5 + Math.PI * step);
		ctx.stroke();

		ctx.fillStyle = 'white';
		ctx.font = `12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${(Math.min(step, value) * 100).toFixed(0)}%`, 32, 32, 64);

		if (value.toFixed(2) === step.toFixed(2)) stopAnimation(name);
	};
	function setup(el: HTMLCanvasElement, percent: number) {
		viewport(el);
		animate = window.innerWidth >= 678
		value = percent / 100;
		step = 0;
		const ctx = el.getContext('2d')!;
		if (!ctx) return;
		el.width = 64;
		el.height = 64;

		function update() {
			if (animate) {
				startAnimation(name, () => draw(ctx));
			} else {
				step = value;
				draw(ctx);
			}
		}

		update();
		return { update };
	}

	const reset = () => {
		value = percent / 100;
		step = 0;
		startAnimation(name, () => draw(context));
	};
</script>

<span>
	<canvas
		on:click|preventDefault={reset}
		use:setup={percent}
		use:viewport
		on:enterViewport={() => reset()}
		title={`Confidence and experience level is above ${percent.toFixed(1)}%`}
	/>
</span>

<style>
	span {
		float: left;
		color: gray;
		font-size: smaller;
		margin-right: 1em;
	}
	canvas {
		border-radius: 50%;
		box-shadow: 0 0 4px black, 0 0 10px black;
		background: black;
	}
</style>
