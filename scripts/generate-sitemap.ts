import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface PageEntry {
	path: string;
	files: string[];
}

const PAGES: PageEntry[] = [
	{
		path: '/',
		files: ['src/routes/+page.svelte', 'src/routes/+page.ts', 'src/lib/components/Home.svelte'],
	},
	{
		path: '/companies',
		files: [
			'src/routes/companies/+page.svelte',
			'src/routes/companies/+page.ts',
			'src/lib/components/containers/Companies.svelte',
			'src/lib/components/items/Company.svelte',
			'src/lib/data/companies.ts',
		],
	},
	{
		path: '/skills',
		files: [
			'src/routes/skills/+page.svelte',
			'src/routes/skills/+page.ts',
			'src/lib/components/containers/Skills.svelte',
			'src/lib/components/items/Skill.svelte',
			'src/lib/data/skills.ts',
		],
	},
	{
		path: '/trainings',
		files: [
			'src/routes/trainings/+page.svelte',
			'src/routes/trainings/+page.ts',
			'src/lib/components/containers/Trainings.svelte',
			'src/lib/components/items/Training.svelte',
			'src/lib/data/trainings.ts',
		],
	},
	{
		path: '/cv',
		files: [
			'src/routes/cv/+page.svelte',
			'src/routes/cv/+page.ts',
			'src/lib/data/contact.ts',
			'src/lib/data/companies.ts',
			'src/lib/data/skills.ts',
			'src/lib/data/trainings.ts',
		],
	},
	{
		path: '/projects',
		files: [
			'src/routes/projects/+page.svelte',
			'src/routes/projects/+page.ts',
			'src/lib/data/projects.ts',
		],
	},
	{
		path: '/about',
		files: [
			'src/routes/about/+page.svelte',
			'src/routes/about/+page.ts',
			'src/lib/components/About.svelte',
			'src/lib/data/skills.ts',
		],
	},
	{
		path: '/print',
		files: [
			'src/routes/print/+page.svelte',
			'src/routes/print/+page.ts',
			'src/lib/components/items/Contact.svelte',
			'src/lib/components/containers/Companies.svelte',
			'src/lib/components/containers/Skills.svelte',
			'src/lib/components/containers/Trainings.svelte',
			'src/lib/data/contact.ts',
			'src/lib/data/companies.ts',
			'src/lib/data/skills.ts',
			'src/lib/data/trainings.ts',
		],
	},
];

const BASE_URL = 'https://www.olivier-rousseau-guyot.com';
const SITEMAP_PATH = resolve(process.cwd(), 'static/sitemap.xml');

function git(cmd: string): string {
	return execSync(cmd, { cwd: process.cwd(), encoding: 'utf-8' }).trim();
}

function getRepoHeadDate(): string {
	return git('git log -1 --format=%cs');
}

function getFileDate(file: string): string {
	try {
		return git(`git log -1 --format=%cs -- ${file}`);
	} catch {
		return '';
	}
}

function getPageLastMod(entry: PageEntry, headDate: string): string {
	const dates = entry.files.map((f) => getFileDate(f)).filter((d) => d.length > 0);

	if (dates.length === 0) {
		return headDate;
	}

	dates.sort();
	return dates[dates.length - 1];
}

function generateXml(): string {
	const headDate = getRepoHeadDate();
	const lines: string[] = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
	];

	for (const page of PAGES) {
		const lastmod = getPageLastMod(page, headDate);
		const locPath = page.path === '/' ? '/' : page.path;
		lines.push('\t<url>');
		lines.push(`\t\t<loc>${BASE_URL}${locPath}</loc>`);
		lines.push(`\t\t<lastmod>${lastmod}</lastmod>`);
		lines.push('\t</url>');
	}

	lines.push('</urlset>\n');
	return lines.join('\n');
}

function main(): void {
	const newXml = generateXml();
	let currentXml = '';
	try {
		currentXml = readFileSync(SITEMAP_PATH, 'utf-8');
	} catch {
		// file does not exist yet
	}

	if (newXml === currentXml) {
		console.log('sitemap up to date');
		process.exit(0);
	}

	writeFileSync(SITEMAP_PATH, newXml, 'utf-8');
	execSync(
		'git commit -m "chore(sitemap): refresh lastmod from git stamps" -- static/sitemap.xml',
		{
			cwd: process.cwd(),
			stdio: 'inherit',
		},
	);

	const shortHash = git('git rev-parse --short HEAD');
	console.log(shortHash);
}

main();
