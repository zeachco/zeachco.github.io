<script lang="ts">
	import { companies } from '$lib/data/companies';
	import { skills } from '$lib/data/skills';

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
	<h2>Hallo recruiters👋</h2>
	<p>Javascript/Nodejs ninja, Code quality evangelist, Technical debt terminator...</p>
	<p>
		I could throw in a few hundred buzz words but instead I invite you you find the skill you need
		from my skills page <a href="/skills">here</a>. Those help me deal with the constant evolution
		of technologies
	</p>

	<h2>A little bit about me</h2>
	<p>
		I wear many hats though identity as a developer. In the past {jsExpYears} years, I have specialized
		with Javascript over many different projects including, but not limited to, payment platforms, analytics
		dashboards, video games, 3D showcases, VR, complex servers farms (with nodeJS), middlewares and reverse
		proxies, command line interface tools, deployment servers, test frameworks, domain registrar systems.
	</p>
	<p>
		I am passionate about technology advancement, Unix environment, Git and web stacks and what I
		like to call software philosophy. Towards the years, I have slowly drifted on the architectural
		portion of my work and team management as well but I always come back to writing code.
	</p>
	<p>
		I have spent around {incExpYears} years building and experimenting around with small business and
		startup structure, building my own company and reinventing my products... sadly I am not a good sale
		person but the process of learning and bringing to life various complex projects months after months
		was so exciting I couldn't stop.
	</p>
	<p>
		Programming apart, I love to snowboard, electronic music, dancing, computer games, general
		learning, and innovation. I am also an early adopter when it comes to technologic gadgets and
		lifestyle.
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
</section>
