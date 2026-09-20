import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
for (const [path, name] of [
	['/', 'mobile-home'],
	['/companies', 'mobile-companies'],
] as const) {
	const page = await browser.newPage();
	await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
	await page
		.goto('http://localhost:5174' + path, { waitUntil: 'networkidle2', timeout: 30000 })
		.catch(() => undefined);
	await new Promise((r) => setTimeout(r, 1200));
	await page.screenshot({ path: `/tmp/shots/final/${name}.png`, fullPage: true });
	console.log(name);
	await page.close();
}
await browser.close();
