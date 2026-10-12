<script lang="ts">
	import PageTransition from './PageTransition.svelte';
	import Brand from './micro/Brand.svelte';
	import shopify from '../icons/shopify.svg';
	import morgan from '../icons/chase.svg';
	import quebecor from '../icons/quebecor.svg';
	import videotron from '../icons/videotron.svg';
	import stay22 from '../icons/s22.webp';
	import playtika from '../icons/playtika.jpg';
	import {
		phantomGame,
		phantomGameFullUrl,
		nextPhantomGame,
		switchPhantomGame,
	} from '$lib/stores/phantomGame';
	import wosp from '../icons/wsop.png';
	import appdirect from '../icons/appdirect.png';
	import adt from '../icons/adt.svg';
	import pod from '../icons/pod.ico';

	const brands = [
		[shopify, 'Shopify', '#fff'],
		[quebecor, 'Québecor'],
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
		<p><b>20+ years</b> shipping software: payments, games, and the infrastructure in between.</p>
		<i
			>Payments, gaming, telecoms, banking, and neural networks (one is running behind this page).</i
		>
		<p>
			I build the unglamorous parts that keep teams fast: CI/CD, tooling, onboarding, integrations.
		</p>
		<p>I rationalize the impossible.</p>
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

		<div class="experiment-header">
			<h4>Have you noticed the AI experiment running in the background of this site?</h4>
			<button class="game-switch" type="button" on:click={switchPhantomGame}>
				switch to the {nextPhantomGame($phantomGame)}
			</button>
		</div>
		{#if $phantomGame === 'cave'}
			<p>
				Balls racing through an infinitely generated cave, <a
					target="_blank"
					href={phantomGameFullUrl('cave')}>live, in your browser.</a
				><br />
				Same setup, in 3D: each ball carries a self-learning net with variable depth, and the nets compete
				to dodge obstacles, clear jumps and hit the gates in order. The cave streams in as the ball goes.
				Every run gets a fresh random tunnel. A second network watches the pack and hot-swaps in the
				winning architecture mid-run.
			</p>
		{:else if $phantomGame === 'climb'}
			<p>
				Climbers scaling an infinitely generated tower, <a
					target="_blank"
					href={phantomGameFullUrl('climb')}>live, in your browser.</a
				><br />
				Same training, in a platformer: each network architecture runs its own pool of climbers racing
				up one-way platforms, with jump timing and stall-or-die height budgets. When the climbers get
				high enough, the seed advances and the tower gets tighter. Every climber trains in the browser,
				single-threaded, plain JavaScript, on a fresh random tower.
			</p>
		{:else}
			<p>
				Cars learning to drive, <a target="_blank" href={phantomGameFullUrl('circuit')}
					>live, in your browser.</a
				><br />
				Each car runs a self-learning neural network with a variable-depth hidden layer, and the nets
				compete for survival: drift to the next waypoint, manage energy, don't crash. Every car trains
				in the browser, single-threaded, plain JavaScript, on a randomly generated track. A second network
				watches the race and picks whichever architecture is winning. It gets hot-swapped in while the
				car is still running.
			</p>
		{/if}
		<p>This is the kind of thing I do just because I can.</p>
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

	.experiment-header {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.game-switch {
		font-family: inherit;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--text-3);
		background: none;
		border: 1px solid var(--line);
		border-radius: var(--radius-control);
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		transition: color 0.2s, border-color 0.2s;
	}

	.game-switch:hover {
		color: var(--accent);
		border-color: var(--accent-line);
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
