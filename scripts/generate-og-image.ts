// Generate the Open Graph / Twitter card image (1200x630) shared by all pages.
// Usage: bun run scripts/generate-og-image.ts
import puppeteer from 'puppeteer';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap" rel="stylesheet">
<style>
	* { margin: 0; padding: 0; box-sizing: border-box; }
	html, body { width: 1200px; height: 630px; overflow: hidden; }
	body {
		background: #0f0e0c;
		font-family: 'DM Sans', system-ui, sans-serif;
		position: relative;
	}
	/* subtle accent glow, top right */
	body::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(620px 420px at 88% 10%, rgba(229, 155, 61, 0.15), transparent 70%);
	}
	.wrap {
		position: absolute;
		inset: 0;
		padding: 68px 88px;
		display: flex;
		flex-direction: column;
	}
	.domain {
		font-size: 20px;
		font-weight: 600;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: #6f695e;
	}
	.bar {
		width: 64px;
		height: 5px;
		border-radius: 2px;
		background: #e59b3d;
		margin: 52px 0 34px;
	}
	.name {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: 84px;
		line-height: 1.05;
		letter-spacing: 0.005em;
		color: #e8e3d9;
	}
	.role {
		font-size: 40px;
		font-weight: 600;
		color: #e59b3d;
		margin-top: 16px;
	}
	.tagline {
		font-size: 29px;
		font-weight: 300;
		line-height: 1.45;
		color: #a49c8d;
		margin-top: 26px;
		max-width: 840px;
	}
	.foot {
		margin-top: auto;
		font-size: 21px;
		font-weight: 400;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #6f695e;
	}
</style>
</head>
<body>
	<div class="wrap">
		<div class="domain">olivier-rousseau-guyot.com</div>
		<div class="bar"></div>
		<div class="name">Olivier Rousseau-Guyot</div>
		<div class="role">Software Engineer</div>
		<div class="tagline">20+ years shipping payments, games, and the infrastructure in between.</div>
		<div class="foot">CV &middot; Skills &middot; Trainings &middot; Projects</div>
	</div>
</body>
</html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-image-'));
const file = join(dir, 'og.html');
writeFileSync(file, html);

const browser = await puppeteer.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
try {
	const page = await browser.newPage();
	await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
	await page.goto(`file://${file}`, { waitUntil: 'networkidle0', timeout: 30000 });
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	await page.evaluate(() => document.fonts?.ready).catch(() => {});
	await new Promise((r) => setTimeout(r, 300));
	const out = join('static', 'og-image.png');
	await page.screenshot({ path: out });
	console.log(out);
} finally {
	await browser.close();
}
