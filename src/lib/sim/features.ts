/**
 * The visitor simulation's input features.
 *
 * Tracks the visitor's actions on the site — hover, navigation, text
 * selection, scrolling, clicks — over a 60-second sliding window plus the
 * whole visit, and turns them into a fixed-size vector in [0, 1], the same
 * convention the game sensors use.
 */

import { clampToRange, PROB_RANGE, type OutputRanges } from './network';

/** the sliding window action rates are measured over */
export const WINDOW_MS = 60_000;

export type ActionKind = 'hover' | 'nav' | 'select' | 'scroll' | 'click';
export const ACTION_KINDS: ActionKind[] = ['hover', 'nav', 'select', 'scroll', 'click'];

/** the routes the site has, one-hot in the feature vector */
export const PAGES = [
	'/',
	'/about',
	'/companies',
	'/cv',
	'/projects',
	'/skills',
	'/trainings',
] as const;

export const INPUT_COUNT = 23;
export const OUTPUT_COUNT = 5;

/**
 * the network's shape: 9 hidden layers, each about 2x-3x the size of the
 * inputs (23) — wide enough to learn the action→outcome mapping, small
 * enough to stay a few hundred KB in localStorage.
 */
export const HIDDEN_LAYER_COUNT = 9;
export const HIDDEN_LAYER_SIZE = 55;
/** node count per column, input to output (11 columns / 10 levels, 25 740 weights) */
export const LAYER_SIZES = [
	INPUT_COUNT,
	...Array.from({ length: HIDDEN_LAYER_COUNT }, () => HIDDEN_LAYER_SIZE),
	OUTPUT_COUNT,
] as const;

/** the five outputs of the simulation, all probabilities */
export const OUTPUT_NAMES = ['stay10', 'stay30', 'stay60', 'cvClick', 'linkClick'] as const;

/** every output is a probability, so every applied range is [0, 1] */
export const OUTPUT_RANGES: OutputRanges = OUTPUT_NAMES.map(() => PROB_RANGE);

/** the stay thresholds the simulation watches, in ms */
export const STAY_THRESHOLDS_MS = [10_000, 30_000, 60_000] as const;

/** what each input position means, in order */
export const INPUT_NAMES = [
	// action rates over the last WINDOW_MS, per second, capped
	'hoverRate', // mouseovers per second / 2
	'navRate', // route changes per second / 0.5
	'selectRate', // text selections per second / 0.5
	'scrollRate', // scroll events per second / 10
	'clickRate', // clicks per second / 1
	// engagement over the last WINDOW_MS
	'actionCount', // all action events in the window / 30
	'actionVariety', // distinct action kinds present / 5
	'idle', // seconds since the last action / 30
	// whole-visit context
	'siteTime', // seconds on the site / 300
	'pageCount', // distinct pages visited / 8
	'scrollDepth', // furthest scroll reached, 0-1
	'scrollVelocity', // scroll distance in the window, px/s / 3000
	'mouseVelocity', // mouse distance in the window, px/s / 2000
	'selectionChars', // log10(1 + selected chars in the window) / 4
	// CV download context
	'cvPage', // 1 while on the /cv route
	'cvHovered', // 1 if the CV nav item or its dropdown was hovered in the last 2s
	// one-hot of the current route (PAGES, in order)
	'pageHome',
	'pageAbout',
	'pageCompanies',
	'pageCv',
	'pageProjects',
	'pageSkills',
	'pageTrainings',
] as const;

const clamp01 = (v: number): number => clampToRange(v, PROB_RANGE);

/** one distance/amount sample, coalesced so fast events don't grow the lists */
type Sample = { t: number; d: number };

export class FeatureState {
	private start: number;
	private lastActivity: number;
	private times: Record<ActionKind, number[]> = {
		hover: [],
		nav: [],
		select: [],
		scroll: [],
		click: [],
	};
	private scrollDist: Sample[] = [];
	private mouseDist: Sample[] = [];
	private selectChars: Sample[] = [];
	private scrollDepth = 0;
	private pagesVisited: string[] = [];
	private cvHoverAt = -Infinity;
	private lastMouse: { x: number; y: number } | null = null;
	/** the current route, one-hot in features() */
	path = '/';

	constructor(path: string) {
		this.start = Date.now();
		this.lastActivity = this.start;
		this.path = path;
		this.pagesVisited = [path];
	}

	private record(kind: ActionKind, now: number): void {
		this.times[kind].push(now);
		this.lastActivity = now;
	}

	/** a mouseover; also notes hovers on the CV nav item / dropdown */
	hover(now: number, target: EventTarget | null): void {
		this.record('hover', now);
		const el = target instanceof Element ? target : null;
		if (el && el.closest && el.closest('.cv-dropdown-container')) {
			this.cvHoverAt = now;
		}
	}

	/** a route change; ignored when the path did not actually change */
	nav(now: number, path: string): void {
		if (path === this.path) return;
		this.path = path;
		if (!this.pagesVisited.includes(path)) this.pagesVisited.push(path);
		this.record('nav', now);
	}

	click(now: number): void {
		this.record('click', now);
	}

	/** a new text selection; `chars` is the amount newly selected */
	select(now: number, chars: number): void {
		this.record('select', now);
		this.pushSample(this.selectChars, now, chars);
	}

	/** a scroll of `distance` px (absolute delta) */
	scroll(now: number, distance: number): void {
		this.record('scroll', now);
		this.pushSample(this.scrollDist, now, distance);
	}

	/** the furthest scroll reached on the document, 0-1 */
	setScrollDepth(fraction: number): void {
		if (fraction > this.scrollDepth) this.scrollDepth = fraction;
	}

	/** pointer movement; distances accumulate between consecutive events */
	mouseMove(now: number, x: number, y: number): void {
		if (this.lastMouse) {
			this.pushSample(this.mouseDist, now, Math.hypot(x - this.lastMouse.x, y - this.lastMouse.y));
		}
		this.lastMouse = { x, y };
	}

	/** coalesce into at most one sample per 250 ms per list */
	private pushSample(list: Sample[], now: number, d: number): void {
		const last = list[list.length - 1];
		if (last && now - last.t < 250) last.d += d;
		else list.push({ t: now, d });
	}

	secondsOnSite(now: number): number {
		return (now - this.start) / 1000;
	}

	/** the INPUT_COUNT-dim vector, every value clamped to [0, 1] */
	features(now: number): number[] {
		const windowStart = now - WINDOW_MS;
		for (const kind of ACTION_KINDS) {
			const list = this.times[kind];
			while (list.length && list[0] < windowStart) list.shift();
		}
		const prune = (list: Sample[]) => {
			while (list.length && list[0].t < windowStart) list.shift();
		};
		prune(this.scrollDist);
		prune(this.mouseDist);
		prune(this.selectChars);

		const windowSeconds = WINDOW_MS / 1000;
		const counts = ACTION_KINDS.map((kind) => this.times[kind].length);
		const totalActions = counts.reduce((a, b) => a + b, 0);
		const variety = counts.filter((c) => c > 0).length;
		const perSecond = (count: number, cap: number): number => clamp01(count / windowSeconds / cap);
		const sum = (list: Sample[]): number => list.reduce((acc, s) => acc + s.d, 0);

		return [
			perSecond(counts[0], 2), // hoverRate
			perSecond(counts[1], 0.5), // navRate
			perSecond(counts[2], 0.5), // selectRate
			perSecond(counts[3], 10), // scrollRate
			perSecond(counts[4], 1), // clickRate
			clamp01(totalActions / 30), // actionCount
			variety / ACTION_KINDS.length, // actionVariety
			clamp01((now - this.lastActivity) / 1000 / 30), // idle
			clamp01(this.secondsOnSite(now) / 300), // siteTime
			clamp01(this.pagesVisited.length / 8), // pageCount
			clamp01(this.scrollDepth), // scrollDepth
			clamp01(sum(this.scrollDist) / windowSeconds / 3000), // scrollVelocity
			clamp01(sum(this.mouseDist) / windowSeconds / 2000), // mouseVelocity
			clamp01(Math.log10(1 + sum(this.selectChars)) / 4), // selectionChars
			this.path === '/cv' ? 1 : 0, // cvPage
			now - this.cvHoverAt < 2000 ? 1 : 0, // cvHovered
			...(PAGES as readonly string[]).map((p) => (p === this.path ? 1 : 0)),
		];
	}
}
