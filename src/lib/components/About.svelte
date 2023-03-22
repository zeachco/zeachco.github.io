<script lang="ts">
	import { companies } from '$lib/data/companies';
	import { skills } from '$lib/data/skills';
	import PageTransition from './PageTransition.svelte';

	const javascript = skills.find(({ name }) => /javascript/i.test(name));
	const gameDev = companies.find(({ note }) => /dark basic pro/i.test(note!));
	const playtika = companies.find(({ name }) => /playtika/i.test(name));

	if (!javascript?.start || !gameDev?.start || !playtika?.start)
		throw new Error(`Missing references`);

	const now = new Date();

	const toYears = 1 / 1000 / 60 / 60 / 24 / 365;
	const jsExpYears = Math.ceil((+now - +javascript.start) * toYears);
	const incExpYears = Math.ceil((+playtika.start - +gameDev.start) * toYears);
</script>

<section>
	<PageTransition pathname="about">
		<h2>Recruiters 👋</h2>
		<p>
			You can find a printable document of this site by clicking
			<a data-tooltip="Printable CV" href="/print">🖨️ here</a> or at the top navigation.
		</p>
		<h2>What kind of engineer am I</h2>
		<p>
			I am a JavaScript/Node.js developer with expertise in code quality, and technical debt
			management. Instead of throwing in a few hundred buzzwords, I invite you to find the specific
			skills you require from my skill page <a href="/skills">here</a>. These skills help me deal
			with the constant evolution of technologies.
		</p>

		<h3>A little bit about me</h3>
		<p>
			I wear many hats but identify primarily as a developer. Over the past {jsExpYears} years, I have
			specialized in JavaScript, working on a variety of projects including payment platforms, analytics
			dashboards, video games, 3D showcases, VR, complex server farms (with Node.js), middlewares and
			reverse proxies, command-line interface tools, deployment servers, test frameworks, and domain
			registrar systems.
		</p>
		<p>
			I am passionate about technological advancements, the Unix environment, Git, web stacks, and
			what I like to call "software philosophy." Over the years, I have slowly drifted towards the
			architectural portion of my work and team management, but I always come back to writing code.
		</p>
		<p>
			I have spent around {incExpYears} years building and experimenting with small businesses and startup
			structures, building my own company, and reinventing my products. Sadly, I am not a good salesperson,
			but the process of learning and bringing various complex projects to life month after month was
			so exciting that I couldn't stop.
		</p>

		<h2>Adaptability</h2>
		<p>
			With my fluency in English and French, as well as some proficiency in Spanish, Portuguese, and
			German, I am confident in my ability to communicate effectively with colleagues and clients
			from diverse backgrounds.
		</p>
		<p>
			As a passionate and experienced software developer, I have cultivated a strong interest in
			open source communities and have contributed to various projects on platforms such as GitHub.
			I am also well-versed in Linux, JavaScript, and Git.
		</p>
		<p>
			Furthermore, I am inspired by companies such as Netflix for their infrastructure, AirBnB,
			Stripe, and Shopify for their contributions to open source, and Walmart, Netflix, Dominos and
			Microsoft for being NodeJs pioneers. I am particularly drawn to the way these companies have
			been able to innovate and push boundaries in the tech industry.
		</p>
		<h2>Personality</h2>
		<p>
			Personality-wise, I love snowboarding, electronic music, dancing, computer games, general
			learning, and innovation. I am also an early adopter when it comes to technological gadgets
			and lifestyle.
		</p>
		<h2>Fun projects, all the time!</h2>
		<p>
			An example of a fun project I've made is <a
				href="https://zeachco.github.io/phantom-game-ai-training/?game=highway">Highway</a
			>, an in-browser machine learning trainer that trains 2D cars to drive on a highway. Be aware
			that the first iterations are CPU-intensive, but the AI should learn to drive in less than 15
			minutes.
		</p>
		<p>
			Disclaimer: This project works better on small resolutions since rendering the multiple layers
			of neural networks takes a tool on retina displays and wide screens.
		</p>
		<!--


Langages
French as native language, Fluent English communicator, some Spanish, Portuguese, German.
Passions and hobbies
Linux, javascript, git, open source community, music, snowboard, flyboard, social dance (mostly salsa and jive), mountain biking, skating and cycling
Companies that inspire me
Netflix for their infrastructure
AirBnB, Stripe, Shopify for their contributions to open source
Walmart and Microsoft for being NodeJs pioneers in their architecture
screeps.com for gamifying a true essence of complex programing scenarios
What I like to work with
Atom, VSCode, Vi/Nano
Linux, Open Source Products, Google products
NodeJS, NPM, Mongo
Webpack, Gulp, ThreeJS, D3, React
Browsers and the F12 key (The full keyboard is even better) -->
	</PageTransition>
</section>
