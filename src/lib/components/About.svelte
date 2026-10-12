<script lang="ts">
	import { skills } from '$lib/data/skills';
	import PageTransition from './PageTransition.svelte';

	const javascript = skills.find(({ name }) => /javascript/i.test(name));
	if (!javascript?.start) throw new Error(`Missing references`);

	const now = new Date();

	const toYears = 1 / 1000 / 60 / 60 / 24 / 365;
	const jsExpYears = Math.ceil((+now - +javascript.start) * toYears);
</script>

<section>
	<PageTransition pathname="about">
		<h2>The kind of engineer I am</h2>
		<p>
			I'm a full-stack engineer, strongest in TypeScript, Node.js and Rust. I care about code
			outliving me: readable, tested, cheap to run. Rather than a buzzword list, here is everything
			I've used, with the years attached: <a href="/skills">skills</a>.
		</p>

		<h3>A little bit about me</h3>
		<p>
			I'm a developer first. In the past {jsExpYears} years of JavaScript I've shipped payment platforms,
			analytics dashboards, a multiplayer poker table, 3D showcases, VR, reverse proxies and middlewares,
			CLI tools, test frameworks and a domain registrar; most of it on Node.js.
		</p>
		<p>
			I am passionate about technological advancements, the Unix environment, Git, web stacks, and
			what I like to call "software philosophy." Over the years, I have gradually shifted focus
			toward the architectural aspects of my work and team management, but I always return to
			writing code.
		</p>
		<p>
			Most of my career was spent in small companies where I owned the whole stack. I also founded
			Yenom myself. The part I keep coming back to is the build: taking a complicated thing from
			zero to running, month after month.
		</p>

		<h3>How I lead</h3>
		<p>
			I've led teams at four scales: I built the India frontend office at AppDirect and trained
			engineers across the company on QA, Git, Java and JavaScript so everyone worked the same way;
			I ran releases, architecture and CI/CD for the World Series of Poker game at Playtika as Scrum
			Master; I led company-wide JavaScript training and code reviews at Morgan Stanley; and I ran
			the developer-experience program at Stay22 (CI/CD, onboarding, security and feature-flag
			training).
		</p>
		<p>
			The short version: I trust people, keep process light, and I'll challenge a decision that
			isn't working, whether technical or organizational.
		</p>

		<h3>Adaptability</h3>
		<p>
			I work in English and French (native), and can hold a technical conversation in Spanish,
			Portuguese and German.
		</p>
		<p>
			I'm drawn to companies that publish what they build. I keep my own machine the way I keep my
			code: boring, fast, mine to tinker with.
		</p>
		<h2>Things I build for fun</h2>
		<p>
			The background of this site is my AI training sandbox: arcade games where self-learning neural
			networks compete, live, in the browser. Four games so far (circuit, cave, highway, climb),
			plain JavaScript, no ML libraries. I wrote the training from scratch in 2021 and I'm still
			adding games. <a
				target="_blank"
				href="https://zeachco.github.io/phantom-game-ai-training/?game=circuit">Play with it</a
			>.
		</p>
		<p>
			There's also <a href="https://zeachco.github.io/cells-ai/">Cells AI</a>: a Rust survival
			simulation of cells that compiles to WebAssembly and runs in the browser. And
			<a href="https://ndax.up.railway.app/">Ndax Bot</a>, a Rust trading bot with a TUI and
			hot-reloadable strategies. <a href="https://yenom.up.railway.app/">Yenom</a> started as a side
			project; it now runs 200+ users on under a dollar a month of infrastructure (Deno + Svelte, OpenAI
			for the advice column).
		</p>
		<p>
			When a business need keeps coming back, I extract it into a package and publish it. <a
				href="https://github.com/zeachco/real-mime-type">real-mime-type</a
			>
			reads the first bytes of a file instead of trusting the extension;
			<a href="https://github.com/zeachco/stubborn-server">stubborn-server</a> (a Node stub server
			for mocking, my most-starred repo),
			<a href="https://github.com/zeachco/css-specs">css-specs</a>
			(programmatic CSS tests) and
			<a href="https://github.com/zeachco/backend-proxy">backend-proxy</a>
			came out the same way.
		</p>
		<h3>Personality</h3>
		<p>
			Off the keyboard: snowboarding, electronic music, and DJing (Denon SC Live 4, open-source
			production). I also build audio software for it: <a href="https://github.com/zeachco/dj-viz"
				>dj-viz</a
			>
			is a real-time visualizer in Rust, cross-compiled down to a Raspberry Pi.
		</p>
		<p>
			I also contributed to Epic's open-source Linux shader compatibility for the engine. If you're
			curious, check out my <a href="https://github.com/zeachco">GitHub profile</a>: the games, the
			Rust, and the tools are all there.
		</p>
	</PageTransition>
</section>
