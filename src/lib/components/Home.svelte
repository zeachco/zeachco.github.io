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
		<h3>Software engineer</h3>
		<p><b>20+ years</b> shipping systems at scale.</p>
		<i>Gaming, web, security, neural networks, telecoms or banking...</i>
		<p>I speed up development flows through platform, management or automated tooling work.</p>
		<p>I make the impossible, possible.</p>
		<p>
			Check out my <a href="https://github.com/zeachco">GitHub</a>, my
			<a href="https://www.linkedin.com/in/zeachco/">LinkedIn</a>
			or just read <a href="/about">About me</a>
		</p>

		<h4>A few companies I worked for</h4>
		<div class="brands">
			{#each brands as [icon, label, styles]}
				<Brand background={styles} svg={icon} name={label} />
			{/each}
		</div>

		<h4>Need more?</h4>
		<p>
			You can find a printable version of this site by clicking
			<a data-tooltip="Printable CV" href="/print">🖨️ here</a> or using the link in the top navigation.
		</p>

		<h4>Hey what's that moving background I see behind this site?</h4>
		<p>
			It's a live simulation of 5000 cells, each with a custom self-learning neural network of a few
			million parameters. It's currently learning to navigate, reproduce and manage energy to
			survive, all training directly into a web browser. Yes you read that correctly, single
			threaded neural network live learning written in rust / web assembly as a prof of concept.
		</p>
		<p>
			This is the kind of things I do just because I can and I love pushing the limits of what's
			possible in environments it shouldn't be.
		</p>
	</PageTransition>
</section>

<style>
	.brands {
		display: flex;
		gap: 2em;
		justify-content: space-evenly;
		flex-wrap: wrap;
		margin-bottom: 1em;
	}
</style>
