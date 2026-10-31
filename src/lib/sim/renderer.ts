/**
 * A little live renderer of the session's single neural network.
 *
 * Only mounted when the site is served from localhost (the root layout
 * checks), so it never ships to real visitors. It redraws a few times a
 * second: every node is a neuron, every line a weight (blue = positive,
 * pink = negative, alpha ∝ |w|), input nodes lit by the current feature
 * values, hidden nodes by activation, output nodes by probability.
 */

import type { VisitorSim } from './simulation';
import { INPUT_COUNT, HIDDEN_LAYER_COUNT, HIDDEN_LAYER_SIZE, OUTPUT_COUNT } from './features';

const WIDTH = 300;
const HEIGHT = 200;
const REDRAW_MS = 400;
/** short labels under the output column, in OUTPUT_NAMES order */
const OUTPUT_LABELS = ['s10', 's30', 's60', 'cv', 'lnk'] as const;
/** weight buckets per sign, alpha rises with |w| */
const BUCKETS = 4;

export function initSimRenderer(sim: VisitorSim, container: HTMLElement): () => void {
	const wrap = document.createElement('div');
	wrap.style.cssText = [
		'position:fixed',
		'left:12px',
		'bottom:12px',
		'z-index:9998',
		'background:rgba(10,12,18,0.88)',
		'border:1px solid rgba(255,255,255,0.12)',
		'border-radius:8px',
		'padding:8px',
		'font:11px/1.4 monospace',
		'color:#cdd3e1',
		'user-select:none',
	].join(';');

	const header = document.createElement('div');
	header.style.cssText =
		'display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:4px;';
	const title = document.createElement('span');
	title.textContent = 'visitor-sim';
	const close = document.createElement('button');
	close.textContent = '–';
	close.style.cssText =
		'background:none;border:none;color:#cdd3e1;cursor:pointer;font:inherit;padding:0 2px;';
	close.addEventListener('click', () => {
		wrap.style.display = wrap.style.display === 'none' ? '' : 'none';
	});
	header.append(title, close);

	const canvas = document.createElement('canvas');
	const dpr = window.devicePixelRatio || 1;
	canvas.width = WIDTH * dpr;
	canvas.height = HEIGHT * dpr;
	canvas.style.width = `${WIDTH}px`;
	canvas.style.height = `${HEIGHT}px`;
	const ctx = canvas.getContext('2d');

	const status = document.createElement('div');
	status.style.cssText = 'margin-top:4px;opacity:0.7;';

	wrap.append(header, canvas, status);
	container.appendChild(wrap);

	function draw() {
		if (!ctx) return;
		const { activations, outputs, weights, version, samples } = sim.snapshot();
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.clearRect(0, 0, WIDTH, HEIGHT);

		const cols = weights.length + 1; // columns = levels + 1
		const colCount = (l: number) => (l < cols - 1 ? weights[l].length : weights[l - 1][0].length);
		const maxCount = Math.max(...weights.map((w) => w.length));
		const span = HEIGHT - 24;
		const colX = (l: number) => 16 + (l * (WIDTH - 44)) / (cols - 1);
		const rowY = (l: number, i: number) => {
			const count = colCount(l);
			const gap = count > 1 ? span / (maxCount - 1) : 0;
			return 12 + (span - gap * (count - 1)) / 2 + i * gap;
		};

		// connections, bucketed by level/sign/alpha so a few hundred strokes
		// draw all ~26k weights
		ctx.lineWidth = 0.5;
		for (let l = 0; l < cols - 1; l++) {
			const from = weights[l];
			const pos = Array.from({ length: BUCKETS }, () => new Path2D());
			const neg = Array.from({ length: BUCKETS }, () => new Path2D());
			for (let i = 0; i < from.length; i++) {
				const x1 = colX(l);
				const y1 = rowY(l, i);
				for (let j = 0; j < from[i].length; j++) {
					const w = from[i][j];
					const idx = Math.min(BUCKETS - 1, Math.floor(Math.abs(w) / 0.12));
					(w >= 0 ? pos : neg)[idx].moveTo(x1, y1);
					(w >= 0 ? pos : neg)[idx].lineTo(colX(l + 1), rowY(l + 1, j));
				}
			}
			for (let b = 0; b < BUCKETS; b++) {
				const a = 0.04 + b * 0.05;
				ctx.strokeStyle = `rgba(96,190,255,${a})`;
				ctx.stroke(pos[b]);
				ctx.strokeStyle = `rgba(255,122,196,${a})`;
				ctx.stroke(neg[b]);
			}
		}

		// nodes: inputs by feature, hidden by |activation|, outputs by probability
		for (let l = 0; l < cols; l++) {
			const count = colCount(l);
			const acts = activations[l];
			for (let i = 0; i < count; i++) {
				const v = acts[i] ?? 0;
				if (l === 0) {
					ctx.fillStyle = `rgba(235,240,255,${0.12 + 0.88 * Math.min(1, v)})`;
				} else if (l === cols - 1) {
					ctx.fillStyle = `rgba(120,255,178,${0.15 + 0.85 * v})`;
				} else {
					const a = Math.min(1, Math.abs(v) / 3);
					ctx.fillStyle = `rgba(160,175,210,${0.1 + 0.5 * a})`;
				}
				ctx.beginPath();
				ctx.arc(colX(l), rowY(l, i), l === 0 || l === cols - 1 ? 2 : 1.4, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		// output labels
		ctx.font = '9px monospace';
		ctx.textAlign = 'right';
		ctx.fillStyle = 'rgba(120,255,178,0.9)';
		for (let i = 0; i < outputs.length; i++) {
			ctx.fillText(
				`${OUTPUT_LABELS[i]} ${outputs[i].toFixed(2)}`,
				colX(cols - 1) - 6,
				rowY(cols - 1, i) + 3,
			);
		}

		status.textContent = `gen ${version} · ${samples} samples · ${INPUT_COUNT}→${HIDDEN_LAYER_COUNT}×${HIDDEN_LAYER_SIZE}→${OUTPUT_COUNT}`;
	}

	draw();
	const timer = window.setInterval(draw, REDRAW_MS);

	return () => {
		window.clearInterval(timer);
		wrap.remove();
	};
}
