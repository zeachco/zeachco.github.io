<script lang="ts">
	import { companies } from '$lib/data/companies';
	import { skills } from '$lib/data/skills';
	import PageTransition from './PageTransition.svelte';

	const javascript = skills.find(({ name }) => /javascript/i.test(name));
	const gameDev = companies.find(({ note }) => /dark basic pro/i.test(note!));
	const playtika = companies.find(({ name }) => /playtika/i.test(name));
	const yenom = companies.find(({ name }) => /yenom/i.test(name));

	if (!javascript?.start || !gameDev?.start || !playtika?.start || !yenom?.note)
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
			You can find a printable version of this site by clicking
			<a data-tooltip="Printable CV" href="/print">🖨️ here</a> or using the link in the top navigation.
		</p>
		<h2>What kind of engineer am I</h2>
		<p>
			I am a JavaScript/Node.js developer with expertise in code quality and technical debt
			management. Instead of listing buzzwords, I invite you to explore the specific skills you
			require on my skills page <a href="/skills">here</a>. These skills enable me to adapt to the
			constant evolution of technologies.
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
			what I like to call "software philosophy." Over the years, I have gradually shifted focus
			toward the architectural aspects of my work and team management, but I always return to
			writing code.
		</p>
		<p>
			I have spent around {incExpYears} years building and experimenting with small businesses and startup
			structures, founding my own company, and reinventing products. While I may not be a natural salesperson,
			the process of learning and bringing various complex projects to life month after month was so
			exciting that I couldn't stop.
		</p>

		<h3>Leadership Approach</h3>
		<p>
			I believe effective leadership means having the courage to challenge past decisions when they
			no longer serve the current situation. I'm not afraid to question the status quo if it leads
			to better outcomes for the team and the product. This approach has earned me respect among
			colleagues who appreciate someone willing to tackle difficult technical and organizational
			challenges head-on.
		</p>
		<p>
			My leadership philosophy centers on trust and pragmatism. I understand that excessive red tape
			can stifle innovation and productivity, so I prefer to trust people's experience and expertise
			rather than imposing unnecessary bureaucracy. This balance between structure and autonomy has
			consistently led to teams that are both productive and empowered to make decisions.
		</p>
		<p>
			Whether navigating complex technical architectures or resolving organizational challenges, I
			take on the difficult problems that others might avoid. My colleagues often turn to me when
			situations require both technical depth and diplomatic finesse—solving issues that span code
			and politics alike.
		</p>

		<h3>Adaptability</h3>
		<p>
			With fluency in English and French, as well as proficiency in Spanish, Portuguese, and German,
			I communicate effectively with colleagues and clients from diverse backgrounds.
		</p>
		<p>
			As a passionate software developer, I actively participate in open source communities and have
			contributed to various projects on platforms such as GitHub. I am well-versed in Linux,
			JavaScript, and Git.
		</p>
		<p>
			I am inspired by companies such as Netflix for their infrastructure, Airbnb, Stripe, and
			Shopify for their contributions to open source, and Walmart, Netflix, Domino's, and Microsoft
			for being Node.js pioneers. I am particularly drawn to how these companies innovate and push
			boundaries in the tech industry.
		</p>
		<h2>Fun projects, all the time!</h2>
		<p>
			An example of a fun project I've made is <a
				href="https://zeachco.github.io/phantom-game-ai-training/?game=highway">Highway</a
			>, an in-browser machine learning trainer that trains 2D cars to drive on a highway. Be aware
			that the first iterations are CPU-intensive, but the AI should learn to drive in less than 15
			minutes. Another fun project is <a href="https://zeachco.github.io/cells-ai/">Cells AI</a>, a
			cellular automata simulation with AI-powered pattern generation and exploration written in
			Rust.
		</p>
		<p>
			Disclaimer: This project works better on small resolutions since rendering the multiple layers
			of neural networks takes a toll on retina displays and wide screens.
		</p>
		<p>
			There's also <a href="https://yenom.up.railway.app/">Yenom</a>!<br />
			{yenom.note}
		</p>
		<p>
			When I identify a gap on the internet that matches a need, I often create a package to address
			it and make it accessible with minimal effort. <a
				href="https://github.com/zeachco/real-mime-type">real-mime-type</a
			> is an example of this approach. When I manage to abstract it from the specific business case
			while maintaining full applicability, it motivates me to refine and improve the concept in my personal
			time, benefiting the company, myself, and the open-source community.
		</p>
		<h3>Personality</h3>
		<p>
			Personality-wise, I love snowboarding, electronic music, dancing, computer games, continuous
			learning, and innovation. I am an early adopter of technological gadgets and lifestyle trends.
		</p>
		<p>
			If you're curious, check out my <a href="https://github.com/zeachco">GitHub profile</a>. I
			produce music and games on the side and am a big fan of open source, having contributed to
			many projects over the years.
		</p>
	</PageTransition>
</section>
