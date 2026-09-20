import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({
	headless: true,
	args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page
	.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 30000 })
	.catch(() => undefined);
await new Promise((r) => setTimeout(r, 1500));
const box = await page.evaluate(() => {
	const brands = [...document.querySelectorAll('.brand')];
	const b = brands.find((x) => x.getAttribute('data-glass-tooltip') === 'Videotron') ?? brands[1];
	const r = b.getBoundingClientRect();
	b.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
	const cs = getComputedStyle(b, '::before');
	return {
		brandRect: { x: r.x, y: r.y, w: r.width, h: r.height },
		before: {
			position: cs.position,
			top: cs.top,
			bottom: cs.bottom,
			left: cs.left,
			transform: cs.transform,
			background: cs.backgroundColor,
			borderRadius: cs.borderRadius,
			whiteSpace: cs.whiteSpace,
			padding: cs.padding,
			opacity: cs.opacity,
			visibility: cs.visibility,
			zIndex: cs.zIndex,
		},
		containerOverflow: getComputedStyle(document.querySelector('.brands-container')).overflow,
	};
});
console.log(JSON.stringify(box, null, 2));
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({
	path: '/tmp/shots/final/tooltip-debug.png',
	clip: { x: 400, y: 380, width: 700, height: 260 },
});
await browser.close();
