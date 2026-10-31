import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type PhantomGame = 'circuit' | 'cave' | 'climb';

const BASE_URL = 'https://www.olivier-rousseau-guyot.com/phantom-game-ai-training/';
const STORAGE_KEY = 'phantom-game';
const BG_STORAGE_KEY = 'phantom-bg';

const GAME_CYCLE: PhantomGame[] = ['circuit', 'cave', 'climb'];

function isPhantomGame(value: string | null): value is PhantomGame {
	return value === 'circuit' || value === 'cave' || value === 'climb';
}

export function nextPhantomGame(game: PhantomGame | null): PhantomGame {
	const index = GAME_CYCLE.indexOf(game ?? 'circuit');
	return GAME_CYCLE[(index + 1) % GAME_CYCLE.length];
}

/**
 * Which phantom game runs behind the site.
 * Stays `null` until `initPhantomGame()` resolves it on the client, so SSR
 * and hydration always agree on the same (circuit) branch of the UI.
 */
export const phantomGame = writable<PhantomGame | null>(null);

/**
 * Background animation: demo mode hides the game panels.
 * The cave starts zoomed out (scale=4) so its wider layout fits behind the site.
 */
export function phantomGameBackgroundUrl(game: PhantomGame): string {
	const params = new URLSearchParams({ demo: 'true', game });
	if (game === 'cave') params.set('scale', '4');
	return `${BASE_URL}?${params}`;
}

/** Full game page for the "watch it" link: no demo, all panels on. */
export function phantomGameFullUrl(game: PhantomGame): string {
	return `${BASE_URL}?game=${game}`;
}

/**
 * Whether the animated background is on. The layout fades the iframe out and
 * removes it when this flips off, and re-adds it when it flips back on.
 */
export const backgroundOn = writable<boolean>(true);

/**
 * Restore the background toggle on the client: on by default, unless the
 * visitor turned it off earlier (remembered for the duration of the visit).
 */
export function initBackgroundOn(): void {
	if (!browser) return;
	backgroundOn.update(() => {
		try {
			if (sessionStorage.getItem(BG_STORAGE_KEY) === 'off') return false;
		} catch {
			// storage unavailable: on for this page load
		}
		return true;
	});
}

/** Toggle the animated background (remembered for this visit). */
export function toggleBackgroundOn(): void {
	backgroundOn.update((on) => {
		const next = !on;
		try {
			sessionStorage.setItem(BG_STORAGE_KEY, next ? 'on' : 'off');
		} catch {
			// storage unavailable: the toggle still applies for this page load
		}
		return next;
	});
}

/**
 * Resolve the background game once per page load: circuit by default, unless
 * the visitor already switched it (remembered for the duration of the visit).
 */
export function initPhantomGame(): void {
	if (!browser) return;
	phantomGame.update((game) => {
		if (game) return game;
		try {
			const visited = sessionStorage.getItem(STORAGE_KEY);
			if (isPhantomGame(visited)) return visited;
			sessionStorage.setItem(STORAGE_KEY, 'circuit');
		} catch {
			// storage unavailable: circuit applies for this page load
		}
		return 'circuit';
	});
}

/** Cycle the background to the next game (remembered for this visit). */
export function switchPhantomGame(): void {
	phantomGame.update((game) => {
		const next: PhantomGame = nextPhantomGame(game);
		try {
			sessionStorage.setItem(STORAGE_KEY, next);
		} catch {
			// storage unavailable: the switch still applies for this page load
		}
		return next;
	});
}
