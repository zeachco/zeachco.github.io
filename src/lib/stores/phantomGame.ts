import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type PhantomGame = 'cave' | 'circuit';

const BASE_URL = 'https://www.olivier-rousseau-guyot.com/phantom-game-ai-training/';
const STORAGE_KEY = 'phantom-game';

function isPhantomGame(value: string | null): value is PhantomGame {
	return value === 'cave' || value === 'circuit';
}

/**
 * Which phantom game runs behind the site.
 * Stays `null` until `initPhantomGame()` resolves it on the client, so SSR
 * and hydration always agree on the same (circuit) branch of the UI.
 */
export const phantomGame = writable<PhantomGame | null>(null);

/** Background animation: demo mode hides the game panels. */
export function phantomGameBackgroundUrl(game: PhantomGame): string {
	return `${BASE_URL}?demo=true&game=${game}`;
}

/** Full game page for the "watch it" link: no demo, all panels on. */
export function phantomGameFullUrl(game: PhantomGame): string {
	return `${BASE_URL}?game=${game}`;
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

/** Switch the background to the other game (remembered for this visit). */
export function switchPhantomGame(): void {
	phantomGame.update((game) => {
		const next: PhantomGame = game === 'cave' ? 'circuit' : 'cave';
		try {
			sessionStorage.setItem(STORAGE_KEY, next);
		} catch {
			// storage unavailable: the switch still applies for this page load
		}
		return next;
	});
}
