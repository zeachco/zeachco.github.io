<script lang="ts">
	import PageTransition from './PageTransition.svelte';
	import Brand from './micro/Brand.svelte';
	import shopify from '../icons/shopify.svg';
	import morgan from '../icons/chase.svg';
	import quebecor from '../icons/quebecor.svg';
	import videotron from '../icons/videotron.svg';
	import stay22 from '../icons/s22.webp';
	import playtika from '../icons/playtika.jpg';
	import wosp from '../icons/wsop.png';
	import appdirect from '../icons/appdirect.png';
	import adt from '../icons/adt.svg';
	import pod from '../icons/pod.ico';

	const brands = [
		[shopify, 'Shopify', '#fff'],
		[quebecor, 'Quebecor Media'],
		[wosp, 'World Series of Poker', '#fff'],
		[appdirect, 'AppDirect', '#fff'],
		[playtika, 'Playtika'],
		[morgan, 'Morgan Stanley', '#fff'],
		[videotron, 'Videotron'],
		[stay22, 'Stay22', '#fff'],
		[pod, 'Work With Pod'],
		[adt, 'ADT security', '#fff'],
	] as const;
</script>

<section>
	<PageTransition pathname="home">
		<h3>Software Engineer</h3>
		<p><b>20+ years</b> shipping systems at scale.</p>
		<i>Gaming, web, security, neural networks, telecoms or banking...</i>
		<p>I speed up development flows through platform, management or automated tooling work.</p>
		<p>I make the impossible, possible.</p>
		<p>
			Check out my <a href="https://github.com/zeachco">GitHub</a>, my
			<a href="https://www.linkedin.com/in/zeachco/">LinkedIn</a>, my
			<a data-glass-tooltip="[Ctrl/Cmd + k]" data-placement="bottom" href="/skills">Skills</a>
			or just read <a href="/about">About me</a>
		</p>

		<h4>A few companies I worked for</h4>
		<div class="brands-container">
			<div class="brands">
				{#each brands as [icon, label, styles]}
					<Brand background={styles} svg={icon} name={label} />
				{/each}
				<!-- Duplicate for seamless loop -->
				{#each brands as [icon, label, styles]}
					<Brand background={styles} svg={icon} name={label} />
				{/each}
			</div>
		</div>

		<h4>Have you noticed the AI experiment running in the background of this site?</h4>
		<p>
			It's a <a target="_blank" href="//www.olivier-rousseau-guyot.com/cells-ai/"
				>live simulation of 5000 cells</a
			>, each with a custom self-learning neural network of a few million parameters. It's currently
			learning to navigate, reproduce and manage energy to survive, all training directly into a web
			browser. Yes you read that correctly, single threaded neural network live learning written in
			rust / web assembly as a proof of concept.
		</p>
		<p>This is the kind of things I do just because I can.</p>
	</PageTransition>
</section>

<style>
	h3 {
		font-size: 2.7rem;
		margin-bottom: 0.6rem;
	}

	/* the CTA paragraph carries the page's main links — let them glow */
	p a {
		color: var(--accent);
	}

	p a:hover {
		color: var(--accent-2);
	}

	h4 {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--text-3);
		margin-top: 3rem;
		margin-bottom: 1.4rem;
	}

	.brands-container {
		overflow: hidden;
		position: relative;
		width: 100%;
		padding-bottom: 2em;
		mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
	}

	.brands {
		display: flex;
		gap: 1.25em;
		flex-wrap: nowrap;
		animation: scroll-brands 30s linear infinite;
		width: fit-content;
		padding: 1rem 0;
	}

	.brands-container:hover .brands {
		animation-play-state: paused;
	}

	@keyframes scroll-brands {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
