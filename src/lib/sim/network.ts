/**
 * Linear neural network, ported from the phantom game's brains.
 *
 * The architecture is the same one the game AI uses: pure linear levels (no
 * bias, no activations), which makes the backpropagation in `train` exact.
 * The visitor simulation feeds it the site's action features and reads five
 * probabilities out of it, clamped to [0, 1] — the same convention the climb
 * game uses for its [0, 1] steering range.
 */

export function rand(min = -1, max = 1): number {
	return min + Math.random() * (max - min);
}

export function lerp(A: number, B: number, t: number): number {
	return A + (B - A) * t;
}

/** learning rate for one gradient step */
export const TEACHING_RATE = 0.05;
/** the decaying rate settles back to the base rate over this many steps */
export const TEACHING_FRAMES = 10_000;
/** persisted weights keep this many decimals */
export const SAVE_PRECISION = 3;

/** storage namespace for this kind of brain */
export const DEFAULT_KIND = 'neural';

/** the applied range of one output, `[min, max]` */
export type OutputRange = [number, number];
/** every output's applied range, indexed by output */
export type OutputRanges = OutputRange[];

/** the simulation's outputs are probabilities */
export const PROB_RANGE: OutputRange = [0, 1];

/** clamps to one output's applied range */
export function clampToRange(value: number, range: OutputRange = PROB_RANGE): number {
	return value < range[0] ? range[0] : value > range[1] ? range[1] : value;
}

/** rounds to a fixed number of decimals, for storage */
export function quantize(value: number, precision = SAVE_PRECISION): number {
	const scale = 10 ** precision;
	return Math.round(value * scale) / scale;
}

/**
 * The error each output sees once the applied range is in place: the clamped
 * output minus the clamped target. Two values that differ only past the bound
 * are equivalent, so only this error trains, and it keeps the network from
 * chasing absurd targets.
 */
export function appliedRangeErrors(
	values: number[],
	targets: number[],
	ranges: OutputRanges = [],
): { errors: number[]; loss: number } {
	const errors = new Array<number>(values.length);
	let loss = 0;
	for (let i = 0; i < values.length; i++) {
		const range = ranges[i] ?? PROB_RANGE;
		const error = clampToRange(values[i], range) - clampToRange(targets[i] ?? 0, range);
		errors[i] = error;
		loss += error * error;
	}
	return { errors, loss };
}

/**
 * The step coefficient of a training run at `frames` into it. It starts
 * eager, four times the base rate, and settles linearly back to the base rate
 * over TEACHING_FRAMES: early steps move the brain fast, later ones polish.
 */
export function teachingRate(frames: number, base = TEACHING_RATE): number {
	if (!Number.isFinite(frames) || frames <= 0) return base * 4;
	const decay = Math.min(1, frames / TEACHING_FRAMES);
	return base * (1 + 3 * (1 - decay));
}

export type SavedLevel = { weights: number[][] };

/** a persisted network; levels are sized from their stored weights */
export type SavedNetwork = {
	kind: string;
	version: number;
	score: number;
	date: number;
	levels: SavedLevel[];
};

/** matches the exact node counts a network built from `layerSizes` must have */
export function isSaveShapeValid(
	saved: unknown,
	layerSizes: readonly number[],
): saved is SavedNetwork {
	const net = saved as SavedNetwork;
	if (!net || !Array.isArray(net.levels) || net.levels.length !== layerSizes.length - 1) {
		return false;
	}
	for (let l = 0; l < net.levels.length; l++) {
		const weights = net.levels[l]?.weights;
		if (!Array.isArray(weights) || weights.length !== layerSizes[l]) return false;
		for (const row of weights) {
			if (!Array.isArray(row) || row.length !== layerSizes[l + 1]) return false;
		}
	}
	return true;
}

export class NeuralNetwork {
	/** amount of generations passed */
	public version = 0;
	public levels: Level[];
	/** number of samples trained on */
	public score = 0;
	/** 0-1 amount kept when merging to another model */
	public mutationFactor = 0.5;
	/** iteration number of the same initial network */
	public mutationIndex = 0.5;
	/** storage namespace */
	public kind: string = DEFAULT_KIND;

	/**
	 * @param layerSizes optional explicit node count per level, starting at
	 * `inputNb` and ending at `outputNb`. Without it, the game-brain rule
	 * applies: `ceil(inputNb/4)` layers sized by lerp between the two ends.
	 */
	constructor(inputNb: number, outputNb: number, layerSizes?: readonly number[]) {
		if (inputNb < outputNb) {
			throw new Error('requires more inputs than outputs');
		}

		this.levels = [];

		if (layerSizes && layerSizes.length >= 2) {
			if (layerSizes[0] !== inputNb || layerSizes[layerSizes.length - 1] !== outputNb) {
				throw new Error('layerSizes must start at inputNb and end at outputNb');
			}
			for (let i = 0; i < layerSizes.length - 1; i++) {
				this.levels.push(new Level(layerSizes[i], layerSizes[i + 1]));
			}
		} else {
			const intermediateLayers = Math.ceil(inputNb / 4);
			for (let i = 0; i < intermediateLayers; i++) {
				const from = Math.floor(lerp(inputNb, outputNb, i / intermediateLayers));
				const to = Math.floor(lerp(inputNb, outputNb, (i + 1) / intermediateLayers));
				this.levels.push(new Level(from, to));
			}
		}
	}

	static feedForward(givenInputs: number[], network: NeuralNetwork) {
		let outputs = Level.feedForward(givenInputs, network.levels[0]);
		for (let i = 1; i < network.levels.length; i++) {
			outputs = Level.feedForward(outputs, network.levels[i]);
		}
		return outputs;
	}

	/** rebuilds a usable network out of a save, levels sized from the stored weights */
	static hydrate(saved: SavedNetwork): NeuralNetwork {
		const network = new NeuralNetwork(1, 1);
		network.levels = (saved.levels || []).map((level) => {
			const weights: number[][] = level.weights;
			const built = new Level(weights.length, weights[0].length);
			for (let i = 0; i < weights.length; i++) {
				for (let j = 0; j < weights[i].length; j++) {
					built.weights[i][j] = weights[i][j];
				}
			}
			return built;
		});
		network.version = saved.version || 0;
		network.score = saved.score || 0;
		network.mutationIndex = 0.5;
		network.mutationFactor = 0;
		network.kind = saved.kind || DEFAULT_KIND;
		return network;
	}

	/** a persistable copy of the network, weights quantized */
	toSave(): SavedNetwork {
		return {
			kind: this.kind,
			version: this.version,
			score: this.score,
			date: Date.now(),
			levels: this.levels.map((level) => ({
				weights: level.weights.map((row) => row.map((weight) => quantize(weight))),
			})),
		};
	}

	/** entry point: run the inputs through the network */
	process(inputs: number[]): number[] {
		return NeuralNetwork.feedForward(inputs, this);
	}

	get inputCount(): number {
		return this.levels[0] ? this.levels[0].weights.length : 0;
	}

	get outputCount(): number {
		const last = this.levels[this.levels.length - 1];
		return last ? last.weights[0].length : 0;
	}

	/** lerp every weight toward random, keeping `mutationFactor` of the random side */
	mutate(network: SavedNetwork): void {
		this.version = network.version;
		for (let l = 0; l < this.levels.length; l++) {
			for (let i = 0; i < this.levels[l].weights.length; i++) {
				for (let j = 0; j < this.levels[l].weights[i].length; j++) {
					this.levels[l].weights[i][j] = lerp(
						network.levels[l].weights[i][j],
						rand(),
						this.mutationFactor,
					);
				}
			}
		}
	}

	/** per-output error of the last train step, straight through the applied range */
	public lastErrors: number[] | null = null;
	/** |weight change| per level, per output node, from the last train step */
	public lastMutations: number[][] | null = null;

	/**
	 * One gradient-descent step that pulls the network's outputs toward
	 * `targets` for `inputs` (MSE, backpropagated through every level). The
	 * network is a pure linear map, so the gradients are exact. Returns the
	 * pre-step loss.
	 */
	public train(
		inputs: number[],
		targets: number[],
		learningRate: number = TEACHING_RATE,
		ranges: OutputRanges = [],
	): number {
		const activations: number[][] = [inputs];
		let current = inputs;
		for (const level of this.levels) {
			current = Level.feedForward(current, level);
			activations.push(current);
		}
		const output = current;
		const { errors, loss } = appliedRangeErrors(output, targets, ranges);
		const deltas = new Array<number>(output.length);
		for (let i = 0; i < output.length; i++) {
			deltas[i] = (2 * errors[i]) / output.length;
		}
		const mutations = NeuralNetwork.#mutationAccumulator(this.levels);
		NeuralNetwork.applyGradients(this.levels, activations, deltas, learningRate, mutations);
		this.lastErrors = errors;
		this.lastMutations = mutations;
		return loss;
	}

	/** one bucket per level, one per output node of that level */
	static #mutationAccumulator(levels: Level[]): number[][] {
		return levels.map((level) => new Array<number>(level.outputs.length).fill(0));
	}

	/**
	 * Walk `deltas` (output-space) back through `levels`, applying one descent
	 * step per weight and propagating the input-space deltas. The step is
	 * scaled by the layer's activation energy (normalised LMS), so the same
	 * rate is stable whatever the input magnitudes are.
	 */
	public static applyGradients(
		levels: Level[],
		activations: number[][],
		deltas: number[],
		learningRate: number,
		mutations: number[][] | null = null,
	): void {
		for (let levelIndex = levels.length - 1; levelIndex >= 0; levelIndex--) {
			const level = levels[levelIndex];
			const into = activations[levelIndex];
			const nextDeltas = levelIndex > 0 ? new Array<number>(into.length).fill(0) : null;
			let energy = 1;
			for (let i = 0; i < into.length; i++) energy += into[i] * into[i];
			const step = learningRate / energy;
			for (let input = 0; input < level.inputs.length; input++) {
				const activation = into[input];
				if (!activation) continue; // zero input: no gradient on this row
				const weights = level.weights[input];
				for (let output = 0; output < level.outputs.length; output++) {
					const delta = deltas[output];
					if (!delta) continue;
					if (nextDeltas) nextDeltas[input] += weights[output] * delta;
					const correction = step * delta * activation;
					// a non finite correction would poison the brain for good
					if (!Number.isFinite(correction)) continue;
					weights[output] -= correction;
					if (mutations) mutations[levelIndex][output] += Math.abs(correction);
				}
			}
			if (nextDeltas) deltas = nextDeltas;
		}
	}
}

export class Level {
	public inputs: number[];
	public outputs: number[];
	public weights: number[][];

	constructor(inputCount = 1, outputCount = 1) {
		this.inputs = new Array(inputCount);
		this.outputs = new Array(outputCount);

		this.weights = [];
		for (let i = 0; i < inputCount; i++) {
			this.weights[i] = new Array(outputCount);
		}

		Level.#randomize(this);
	}

	static #randomize(level: Level) {
		for (let i = 0; i < level.inputs.length; i++) {
			for (let j = 0; j < level.outputs.length; j++) {
				level.weights[i][j] = rand();
			}
		}
	}

	static feedForward(givenInputs: number[], level: Level) {
		for (let i = 0; i < level.inputs.length; i++) {
			level.inputs[i] = givenInputs[i];
		}

		for (let i = 0; i < level.outputs.length; i++) {
			let sum = 0;
			for (let j = 0; j < level.inputs.length; j++) {
				sum += level.inputs[j] * level.weights[j][i];
			}
			level.outputs[i] = sum;
		}

		return level.outputs;
	}
}
