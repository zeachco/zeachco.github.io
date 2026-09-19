// Screenshot the dev server for design iteration.
// Usage: bun run scripts/screenshot.ts <outDir> [route=interaction ...]
// Interactions: "clickCV" (open CV dropdown), "skills" (tick frontend role),
// "search" (tick frontend + type 'react')
import puppeteer from 'puppeteer';

const BASE = 'http://localhost:5174';
const outDir = process.argv[2] ?? '/tmp/shots';

const routes: Array<[string, string, string]> = [
	['/', '', 'home'],
	['/about', '', 'about'],
	['/companies', '', 'companies'],
	['/trainings', '', 'trainings'],
	['/skills', 'skills', 'skills'],
	['/skills', 'search', 'skills-search'],
	['/skills', 'clickCV', 'nav-dropdown'],
	['/cv', '', 'cv'],
];

import { mkdirSync } from 'node:fs';
mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const [path, interaction, name] of routes) {
	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });
	// networkidle2 can stall on the external cells-ai iframe; the page is usable anyway
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	await page.evaluate(() => document.fonts?.ready).catch(() => {});

	if (interaction === 'clickCV') {
		await page.evaluate(() => {
			const a = [...document.querySelectorAll('nav a')].find((x) => x.textContent?.includes('CV'));
			(a as HTMLElement)?.click();
		});
	} else if (interaction === 'skills' || interaction === 'search') {
		await page.evaluate((doSearch: boolean) => {
			const boxes = [...document.querySelectorAll('.selectors input[type=checkbox]')];
			boxes.forEach((b) => (b as HTMLInputElement).click());
			if (doSearch) {
				const input = document.querySelector('.search-box input') as HTMLInputElement;
				input.value = 'react';
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}, interaction === 'search');
		await new Promise((r) => setTimeout(r, 800));
	}

	await new Promise((r) => setTimeout(r, 1500));
	const file = `${outDir}/${name}.png`;
	await page.screenshot({ path: file, fullPage: true });
	console.log(file);
	await page.close();
}

await browser.close();
