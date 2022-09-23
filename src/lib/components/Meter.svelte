<script lang="ts">
	export let percent = 0;

	$: value = percent / 100;
	$: step = 0;
	$: lastReq = 0;
	$: draw = (ctx: CanvasRenderingContext2D) => {
		if (value.toFixed(2) !== step.toFixed(2)) lastReq = requestAnimationFrame(() => draw(ctx));
		const diff = value - step;
		step += diff / 50;

		ctx.setLineDash([]);
		ctx.beginPath();
		ctx.fillStyle = `rgba(0, 0, 0, .75)`;
		ctx.lineWidth = 1;
		ctx.strokeStyle = `white`;
		ctx.arc(32, 32, 30, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();
		ctx.beginPath();
		ctx.setLineDash([3, 1]);
		ctx.strokeStyle = `hsl(${step * 90}, 50%, 50%)`;
		ctx.lineWidth = 10;
		ctx.arc(32, 32, 20, Math.PI * 0.5 + Math.PI * -step, Math.PI * 0.5 + Math.PI * step);
		ctx.stroke();

		ctx.fillStyle = 'white';
		ctx.font = `12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(`${(Math.min(step, value) * 100).toFixed(0)}%`, 32, 32, 64);
	};

	function setup(el: HTMLCanvasElement, percent: number) {
		value = percent / 100;
		step = 0;
		const ctx = el.getContext('2d')!;
		if (!ctx) return;
		el.width = 64;
		el.height = 64;

		draw(ctx);
		return {
			update() {
				cancelAnimationFrame(lastReq);
				draw(ctx);
			},
		};
	}

	const reset = () => {
		value = percent / 100;
		step = 0;
	};
</script>

<span>
	<div class="no-print">
		<canvas
			on:click={reset}
			use:setup={percent}
			title={`Confidence and experience level is above ${percent.toFixed(1)}%`}
		/>
	</div>
</span>

<style>
	span {
		float: right;
		color: gray;
		font-size: smaller;
	}
</style>
