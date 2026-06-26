<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { contact } from '$lib/data/contact';
	import { companies } from '$lib/data/companies';
	import { skills } from '$lib/data/skills';
	import { trainings } from '$lib/data/trainings';
	import type { Role, SkillData } from '$lib/types';

	let selectedRoles: Role[] = [];

	$: if (browser) {
		const rolesParam = $page.url.searchParams.get('roles');
		selectedRoles = rolesParam ? (rolesParam.split(',') as Role[]) : [];
	}

	function avgScore(item: { score: Record<Role, number> }, roles: Role[]): number {
		if (!roles.length) return 1;
		return roles.reduce((s, r) => s + (item.score[r] ?? 0), 0) / roles.length;
	}

	const ROLE_TITLES: Record<string, string> = {
		frontend: 'Frontend Developer',
		backend: 'Backend Developer',
		techlead: 'Tech Lead',
		management: 'Engineering Manager',
		'backend,frontend': 'Full-Stack Developer',
		'frontend,techlead': 'Frontend Tech Lead',
		'backend,techlead': 'Backend Tech Lead',
		'backend,frontend,techlead': 'Full-Stack Developer & Tech Lead',
		'backend,frontend,management,techlead': 'Full-Stack Developer & Tech Lead',
	};

	function getTitle(roles: Role[]): string {
		const key = [...roles].sort().join(',');
		return (
			ROLE_TITLES[key] ??
			(roles.length
				? roles.map((r) => r[0].toUpperCase() + r.slice(1)).join(' / ')
				: 'Full-Stack Developer & Tech Lead')
		);
	}

	const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	const fmt = (d: Date) => `${MO[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
	const yr = (d: Date) => String(d.getUTCFullYear());

	$: visibleCompanies = companies
		.filter((c) => c.note && avgScore(c, selectedRoles) >= 0.7)
		.sort((a, b) => b.start.getTime() - a.start.getTime());

	function getGroup(s: SkillData): string {
		const l = s.labels;
		if (l.includes('domain')) return 'Domains';
		if (l.includes('ai')) return 'AI / ML';
		if (l.includes('platform')) return 'Platform & DevOps';
		if ((l.includes('library') || l.includes('framework')) && l.includes('client'))
			return 'Frontend Libraries';
		if (l.includes('client') && l.includes('server')) return 'Core';
		if (l.includes('client')) return 'Frontend';
		if (l.includes('server')) return 'Backend';
		return 'Domains';
	}

	const GROUP_ORDER = [
		'Core',
		'Frontend',
		'Backend',
		'Frontend Libraries',
		'Platform & DevOps',
		'AI / ML',
		'Domains',
	];

	$: skillGroups = GROUP_ORDER.map((g) => ({
		g,
		items: skills
			.filter((s) => !s.softskill && avgScore(s, selectedRoles) >= 0.6 && getGroup(s) === g)
			.sort((a, b) => b.percent - a.percent)
			.map((s) => ({ name: s.name, percent: s.percent })),
	})).filter((x) => x.items.length);

	$: languages = skills
		.filter((s) => s.softskill && s.percent >= 50 && avgScore(s, selectedRoles) >= 0.3)
		.map((s) => {
			const pct = s.percent;
			const level =
				pct >= 95 ? 'native' : pct >= 75 ? 'fluent' : 'conversational';
			return { name: s.name.split(' ').slice(1).join(' '), level };
		});

	$: title = getTitle(selectedRoles);
</script>

<svelte:head>
	<title>{contact.name} — CV</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="cv-shell">
	<div class="cv">
		<!-- Header -->
		<header class="cv-head">
			<div class="cv-ident">
				<h1 class="cv-name">{contact.name}</h1>
				<p class="cv-role">{title}</p>
			</div>
			<address class="cv-links">
				<a href="mailto:{contact.email}">{contact.email}</a>
				<span>{contact.phone}</span>
				<a href="https://github.com/zeachco">github.com/zeachco</a>
				<a href="https://linkedin.com/in/zeachco">linkedin.com/in/zeachco</a>
				<a href="/about" class="no-print">about me</a>
			</address>
		</header>

		{#if selectedRoles.length}
			<p class="cv-role-badge no-print">Filtered: {selectedRoles.join(', ')}</p>
		{/if}

		<!-- Experience -->
		<section class="cv-section">
			<h2 class="section-hd">Experience</h2>
			{#each visibleCompanies as c}
				<div class="exp-item">
					<div class="exp-row">
						<strong class="exp-co">{c.name}</strong>
						<span class="exp-date">{fmt(c.start)} – {c.end ? fmt(c.end) : 'present'}</span>
					</div>
					{#if c.role}<p class="exp-title">{c.role}</p>{/if}
					{#if c.bullets}
						<ul class="exp-bullets">
							{#each c.bullets as b}<li>{b}</li>{/each}
						</ul>
					{:else if c.note}
						<p class="exp-body">{c.note}</p>
					{/if}
				</div>
			{/each}
		</section>

		<!-- Skills + Education/Languages -->
		<div class="cv-lower">
			<section class="cv-section">
				<h2 class="section-hd">Skills</h2>
				<dl class="skill-dl">
					{#each skillGroups as { g, items }}
						<div class="skill-row">
							<dt class="skill-cat">{g}</dt>
							<dd class="skill-val">{#each items as s, i}{#if s.percent >= 85}<strong>{s.name}</strong>{:else}{s.name}{/if}{i < items.length - 1 ? ', ' : ''}{/each}</dd>
						</div>
					{/each}
				</dl>
			</section>

			<div class="cv-right">
				<section class="cv-section">
					<h2 class="section-hd">Certifications & Training</h2>
					{#each trainings as t}
						<div class="edu-item">
							<span class="edu-name">{t.name}</span>
							<span class="edu-yr">{yr(t.start)}–{yr(t.end)}</span>
						</div>
					{/each}
				</section>

				{#if languages.length}
					<section class="cv-section">
						<h2 class="section-hd">Languages</h2>
						{#each languages as l}
							<div class="lang-item">
								<span class="lang-name">{l.name}</span>
								<span class="lang-lv">{l.level}</span>
							</div>
						{/each}
					</section>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	/* ── Shell: full-screen overlay in browser, static for Puppeteer print ── */
	.cv-shell {
		position: fixed;
		inset: 0;
		z-index: 9999;
		background: #fff;
		overflow-y: auto;
		color: #111;
		font-family: 'DM Sans', system-ui, sans-serif;
		font-size: 16px;
		line-height: 1.55;
		-webkit-font-smoothing: antialiased;
		/* Kill Pico CSS dark-theme variables */
		--pico-color: #111;
		--pico-background-color: #fff;
		--pico-h1-color: #111;
		--pico-h2-color: #111;
		--pico-h3-color: #111;
		--pico-primary: #1e3a5f;
		--pico-primary-background: #1e3a5f;
		--pico-font-size: 16px;
	}

	/* Kill the root layout's universal text-shadow */
	.cv-shell :global(*) {
		text-shadow: none !important;
		box-shadow: none !important;
	}

	@media print {
		.cv-shell {
			position: static;
			overflow: visible;
			background: #fff;
		}

		.no-print {
			display: none !important;
		}

		/* Hide root layout chrome (nav header, contact footer, animated bg) */
		:global(nav),
		:global(.animated-background),
		:global(iframe),
		:global(footer) {
			display: none !important;
		}

		/* Hide the Contact component rendered by root layout outside our shell */
		:global(main > section.grid) {
			display: none !important;
		}
	}

	/* ── Document container ─────────────────────────────────────────── */
	.cv {
		max-width: 180mm;
		margin: 0 auto;
		padding: 12mm 0 16mm;
	}

	@media print {
		.cv {
			padding: 0;
			max-width: 100%;
		}
	}

	/* ── Header ─────────────────────────────────────────────────────── */
	.cv-head {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: end;
		gap: 1em;
		padding-bottom: 5mm;
		border-bottom: 1.5px solid #111;
		margin-bottom: 7mm;
	}

	.cv-name {
		font-family: 'DM Serif Display', Georgia, 'Times New Roman', serif !important;
		font-size: 2.2em !important;
		font-weight: 400 !important;
		letter-spacing: -0.02em !important;
		line-height: 1 !important;
		color: #111 !important;
		margin: 0 0 4px !important;
		padding: 0 !important;
		background: none !important;
		border: none !important;
	}

	.cv-role {
		font-size: 0.72em;
		font-weight: 300;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #666;
		margin: 0;
	}

	.cv-links {
		font-style: normal;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
		font-size: 0.75em;
		font-weight: 300;
		flex-shrink: 0;
	}

	.cv-links a {
		color: #1e3a5f !important;
		text-decoration: none !important;
	}

	.cv-links span {
		color: #555;
	}

	/* ── Section heading ────────────────────────────────────────────── */
	.section-hd {
		font-family: 'DM Sans', system-ui, sans-serif !important;
		font-size: 0.65em !important;
		font-weight: 600 !important;
		letter-spacing: 0.25em !important;
		text-transform: uppercase !important;
		color: #111 !important;
		border: none !important;
		border-bottom: 1px solid #111 !important;
		padding: 0 0 2.5px !important;
		margin: 0 0 4mm !important;
		background: none !important;
		display: block;
	}

	.cv-section {
		margin-bottom: 6mm;
	}

	/* ── Experience ─────────────────────────────────────────────────── */
	.exp-item {
		margin-bottom: 4.5mm;
		page-break-inside: avoid;
	}

	.exp-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1em;
		margin-bottom: 2px;
	}

	.exp-co {
		font-size: 0.95em;
		font-weight: 600;
		color: #1e3a5f;
		letter-spacing: 0.01em;
	}

	.exp-title {
		margin: 1px 0 3px;
		font-size: 0.8em;
		font-weight: 400;
		color: #888;
		font-style: italic;
	}

	.exp-bullets {
		margin: 3px 0 0 1.1em;
		padding: 0;
		font-size: 0.85em;
		font-weight: 300;
		color: #333;
		line-height: 1.6;
	}

	.exp-bullets li {
		margin-bottom: 1px;
	}

	.cv-role-badge {
		font-size: 0.72em;
		color: #1e3a5f;
		background: #eef2f7;
		border: 1px solid #c5d3e8;
		border-radius: 4px;
		padding: 2px 8px;
		display: inline-block;
		margin-bottom: 5mm;
	}

	.no-print {
		display: revert;
	}

	.exp-date {
		font-size: 0.75em;
		font-weight: 300;
		color: #888;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.exp-body {
		margin: 0;
		font-size: 0.85em;
		font-weight: 300;
		color: #333;
		line-height: 1.6;
	}

	/* ── Lower two-column ───────────────────────────────────────────── */
	.cv-lower {
		display: grid;
		grid-template-columns: 1fr 0.5fr;
		gap: 8mm;
	}

	/* ── Skills ─────────────────────────────────────────────────────── */
	.skill-dl {
		margin: 0;
		padding: 0;
	}

	.skill-row {
		display: grid;
		grid-template-columns: 10em 1fr;
		gap: 3px;
		margin-bottom: 4px;
		align-items: baseline;
	}

	.skill-cat {
		font-size: 0.72em;
		font-weight: 600;
		color: #1e3a5f;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.skill-val {
		font-size: 0.85em;
		font-weight: 300;
		color: #333;
		line-height: 1.5;
		margin: 0;
		padding: 0;
	}

	/* ── Education ──────────────────────────────────────────────────── */
	.edu-item {
		margin-bottom: 4px;
		page-break-inside: avoid;
	}

	.edu-name {
		display: block;
		font-size: 0.75em;
		font-weight: 400;
		color: #222;
		line-height: 1.4;
	}

	.edu-yr {
		display: block;
		font-size: 0.68em;
		font-weight: 300;
		color: #aaa;
		margin-bottom: 5px;
	}

	/* ── Languages ──────────────────────────────────────────────────── */
	.lang-item {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 2px;
	}

	.lang-name {
		font-size: 0.85em;
		font-weight: 400;
		color: #222;
	}

	.lang-lv {
		font-size: 0.75em;
		font-weight: 300;
		color: #aaa;
		font-style: italic;
	}
</style>
