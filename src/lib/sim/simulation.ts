/**
 * The visitor simulation.
 *
 * The site is the "game" and the visitor is the "player": their actions
 * (hover, navigation, text selection, scrolling, clicks) become the input
 * features (features.ts), and a small linear network — the same architecture
 * as the phantom game brains (network.ts) — predicts five probabilities:
 *
 *   stay10     still here after 10 seconds
 *   stay30     still here after 30 seconds
 *   stay60     still here after 60 seconds
 *   cvClick    clicks the CV download
 *   linkClick  clicks another link
 *
 * Every time one of those events actually happens, the input vector and the
 * event label are saved to localStorage, and the network takes a few
 * gradient steps on it plus a few replayed samples. The trained weights are
 * persisted too, so the simulation keeps learning across visits.
 *
 * Privacy: everything stays in this browser. Samples, weights and stats go
 * to localStorage only; nothing is sent to any server.
 */

import {
	NeuralNetwork,
	Level,
	clampToRange,
	isSaveShapeValid,
	quantize,
	teachingRate,
	type SavedNetwork,
} from './network';
import {
	FeatureState,
	INPUT_COUNT,
	LAYER_SIZES,
	OUTPUT_COUNT,
	OUTPUT_NAMES,
	OUTPUT_RANGES,
	STAY_THRESHOLDS_MS,
} from './features';

/** where the simulation persists, all local to this browser */
const KEYS = {
	samples: 'zeachco.sim.samples.v1',
	net: 'zeachco.sim.net.v1',
	stats: 'zeachco.sim.stats.v1',
} as const;

/** the replay buffer of saved samples */
const SAMPLE_CAP = 400;
/** how many saved samples get replayed after each new one */
const REPLAY_STEPS = 3;
/** how often the stay thresholds are checked */
const CHECK_INTERVAL_MS = 1000;
/** mouseover events closer than this are ignored */
const HOVER_THROTTLE_MS = 100;

/** a labeled sample, saved the moment the event happens */
type StoredSample = {
	/** the input features at event time, 2 decimals */
	i: number[];
	/** the five target values (0/1) for this event */
	t: number[];
	/** when the event happened, ms since epoch */
	d: number;
};

type StoredStats = {
	/** page loads this simulation has seen */
	visits: number;
	/** labeled samples saved so far */
	samples: number;
	/** gradient steps applied so far, drives the decaying learning rate */
	trained: number;
	/** CV download clicks observed so far */
	cvClicks: number;
	/** other link clicks observed so far */
	linkClicks: number;
	/** last page load, ms since epoch */
	lastVisit: number;
};

function readJSON<T>(key: string): T | null {
	try {
		const raw = window.localStorage.getItem(key);
		return raw ? (JSON.parse(raw) as T) : null;
	} catch {
		return null;
	}
}

function writeJSON(key: string, value: unknown): void {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// storage full or blocked (private mode): the simulation keeps running in memory
	}
}

function loadSamples(): StoredSample[] {
	const saved = readJSON<StoredSample[]>(KEYS.samples);
	if (!Array.isArray(saved)) return [];
	return saved
		.filter(
			(s) =>
				s &&
				Array.isArray(s.i) &&
				s.i.length === INPUT_COUNT &&
				Array.isArray(s.t) &&
				s.t.length === OUTPUT_COUNT,
		)
		.slice(-SAMPLE_CAP);
}

function loadStats(): StoredStats {
	const saved = readJSON<Partial<StoredStats>>(KEYS.stats);
	return {
		visits: 0,
		samples: 0,
		trained: 0,
		cvClicks: 0,
		linkClicks: 0,
		lastVisit: 0,
		...saved,
	};
}

function loadNet(): NeuralNetwork | null {
	const saved = readJSON<SavedNetwork>(KEYS.net);
	if (!saved || !isSaveShapeValid(saved, LAYER_SIZES)) return null;
	return NeuralNetwork.hydrate(saved);
}

/** a live view of the session's single network, for the localhost renderer */
export type NetworkSnapshot = {
	/** current input features, [0,1] */
	features: number[];
	/** activations per column, inputs to outputs */
	activations: number[][];
	/** the clamped output probabilities, in OUTPUT_NAMES order */
	outputs: number[];
	/** weights per level: rows = input nodes, columns = output nodes */
	weights: number[][][];
	/** the persisted generation of the network */
	version: number;
	/** samples saved so far */
	samples: number;
};

export type VisitorSim = {
	/** feed a route change; wired to the SPA navigation */
	navigate(pathname: string): void;
	/** the network's current probabilities, keyed by OUTPUT_NAMES */
	probabilities(): Record<string, number>;
	/** a live snapshot of the network (weights, activations, probabilities) */
	snapshot(): NetworkSnapshot;
	/** detach every listener and timer */
	dispose(): void;
};

export function initVisitorSim(): VisitorSim {
	const state = new FeatureState(window.location.pathname);
	// one network per user, reloaded from localStorage when a trained one exists
	const net = loadNet() ?? new NeuralNetwork(INPUT_COUNT, OUTPUT_COUNT, LAYER_SIZES);
	const samples = loadSamples();
	const stats = loadStats();
	stats.visits += 1;
	stats.lastVisit = Date.now();
	writeJSON(KEYS.stats, stats); // count the visit even if no event ever fires

	// which outcomes are already known for this visit
	const stayFired = [false, false, false];
	let cvClicked = false;
	let linkClicked = false;
	let endEmitted = false;
	let lastScrollPos = 0;
	let lastHoverAt = 0;
	let lastSelectLen = 0;
	let disposed = false;

	/** the target vector: the outcomes known at this moment */
	const target = (event: { cv?: boolean; link?: boolean } = {}): number[] => [
		stayFired[0] ? 1 : 0,
		stayFired[1] ? 1 : 0,
		stayFired[2] ? 1 : 0,
		event.cv || cvClicked ? 1 : 0,
		event.link || linkClicked ? 1 : 0,
	];

	/** save the event to localStorage, persist it, train on it */
	const emit = (t: number[]): void => {
		const now = Date.now();
		const inputs = state.features(now);
		const sample: StoredSample = {
			i: inputs.map((v) => quantize(v, 2)),
			t,
			d: now,
		};
		samples.push(sample);
		while (samples.length > SAMPLE_CAP) samples.shift();
		writeJSON(KEYS.samples, samples);
		stats.samples += 1;

		// one step on the new sample, then a few replayed ones, so a single
		// event nudges the brain without letting it forget the rest
		const rate = teachingRate(stats.trained);
		net.train(sample.i, sample.t, rate, OUTPUT_RANGES);
		stats.trained += 1;
		for (let k = 0; k < REPLAY_STEPS; k++) {
			const replay = samples[Math.floor(Math.random() * (samples.length - 1))];
			net.train(replay.i, replay.t, rate, OUTPUT_RANGES);
			stats.trained += 1;
		}

		net.score = stats.samples;
		net.version += 1;
		writeJSON(KEYS.net, net.toSave());
		writeJSON(KEYS.stats, stats);
	};

	/** the stay thresholds fire once each, in order */
	const checkStays = (): void => {
		const elapsed = state.secondsOnSite(Date.now()) * 1000;
		for (let i = 0; i < STAY_THRESHOLDS_MS.length; i++) {
			if (elapsed >= STAY_THRESHOLDS_MS[i] && !stayFired[i]) {
				stayFired[i] = true;
				emit(target());
			}
		}
	};

	/** the visit's final outcome, saved when the tab hides or the page unloads */
	const endSession = (): void => {
		if (endEmitted) return;
		endEmitted = true;
		emit(target());
	};

	const onHover = (e: MouseEvent): void => {
		const now = Date.now();
		if (now - lastHoverAt < HOVER_THROTTLE_MS) return;
		lastHoverAt = now;
		state.hover(now, e.target);
	};

	const onClick = (e: MouseEvent): void => {
		const now = Date.now();
		state.click(now);
		const el = e.target instanceof Element ? e.target : null;
		const anchor = el ? el.closest('a') : null;
		if (!anchor) return;
		if (anchor.classList.contains('download-btn')) {
			// the CV download (the header's download button)
			cvClicked = true;
			stats.cvClicks += 1;
			emit(target({ cv: true }));
			return;
		}
		if (anchor.closest('.cv-dropdown-container')) {
			// the "CV" nav item only opens the dropdown, part of the CV flow
			return;
		}
		// any other link: nav, external, mailto, tel
		linkClicked = true;
		stats.linkClicks += 1;
		emit(target({ link: true }));
	};

	/** capture phase: catches inner containers' scrolls (e.g. the CV overlay) too */
	const onScroll = (e: Event): void => {
		const now = Date.now();
		let pos: number;
		if (e.target === document || e.target === window) {
			pos = window.scrollY;
		} else if (e.target instanceof HTMLElement) {
			pos = e.target.scrollTop;
		} else {
			return;
		}
		state.scroll(now, Math.abs(pos - lastScrollPos));
		lastScrollPos = pos;
		const doc = document.documentElement;
		const max = doc.scrollHeight - window.innerHeight;
		if (max > 0) {
			state.setScrollDepth(Math.min(1, (window.scrollY + window.innerHeight) / doc.scrollHeight));
		}
	};

	const onMove = (e: MouseEvent): void => {
		state.mouseMove(Date.now(), e.clientX, e.clientY);
	};

	const onSelect = (): void => {
		const len = window.getSelection()?.toString().length ?? 0;
		if (len > lastSelectLen) {
			state.select(Date.now(), len - lastSelectLen);
		}
		lastSelectLen = len;
	};

	const onVisibility = (): void => {
		if (document.visibilityState === 'hidden') {
			endSession();
		} else {
			endEmitted = false;
		}
	};

	const navigate = (pathname: string): void => {
		state.nav(Date.now(), pathname);
	};

	document.addEventListener('mouseover', onHover, { passive: true });
	document.addEventListener('click', onClick);
	document.addEventListener('mousemove', onMove, { passive: true });
	document.addEventListener('scroll', onScroll, { passive: true, capture: true });
	document.addEventListener('selectionchange', onSelect);
	document.addEventListener('visibilitychange', onVisibility);
	window.addEventListener('pagehide', endSession);
	const timer = window.setInterval(checkStays, CHECK_INTERVAL_MS);

	const dispose = (): void => {
		if (disposed) return;
		disposed = true;
		document.removeEventListener('mouseover', onHover);
		document.removeEventListener('click', onClick);
		document.removeEventListener('mousemove', onMove);
		document.removeEventListener('scroll', onScroll, true);
		document.removeEventListener('selectionchange', onSelect);
		document.removeEventListener('visibilitychange', onVisibility);
		window.removeEventListener('pagehide', endSession);
		window.clearInterval(timer);
	};

	const probabilities = (): Record<string, number> => {
		const { outputs } = snapshot();
		const out: Record<string, number> = {};
		for (let i = 0; i < OUTPUT_NAMES.length; i++) out[OUTPUT_NAMES[i]] = outputs[i];
		return out;
	};

	/**
	 * Run the current features through the network once and report the
	 * activations of every column alongside the weights, so a renderer can
	 * draw the whole brain as it stands right now.
	 */
	const snapshot = (): NetworkSnapshot => {
		const features = state.features(Date.now());
		const activations: number[][] = [features];
		let current = features;
		for (const level of net.levels) {
			current = Level.feedForward(current, level);
			activations.push(current);
		}
		const outputs = activations[activations.length - 1].map((v) => clampToRange(v));
		return {
			features,
			activations,
			outputs,
			weights: net.levels.map((level) => level.weights),
			version: net.version,
			samples: samples.length,
		};
	};

	// a small debug handle, e.g. window.__visitorSim.probabilities() in the console
	const win = window as Window & { __visitorSim?: VisitorSim & { samples: () => number } };
	win.__visitorSim = {
		navigate,
		probabilities,
		snapshot,
		dispose,
		samples: () => samples.length,
	};

	return { navigate, probabilities, snapshot, dispose };
}
