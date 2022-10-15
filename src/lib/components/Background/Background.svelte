<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	const sizes = [1, 1, 2, 3, 4];

	function randomPosition(min = 1, max = 100) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	interface Star {
		left: number;
		top: number;
		size: number;
		className: string;
	}

	$: stars = [] as Star[];

	onMount(() => {
		stars = [];
		const total = window.innerWidth / 6;
		for (let i = 0; i < total; i++) {
			const top = randomPosition();
			const left = randomPosition();
			const random = Math.floor(Math.random() * sizes.length);
			const size = sizes[random];
			const className = `star${Math.ceil(i / Math.round(total / 6))}`;
			stars.push({ left, top, size, className });
		}
	});

	onDestroy(() => {
		stars = [];
	});
</script>

<div class="light">
	{#each stars as star}
		<div
			class={star.className + ' star-base'}
			style={`top: ${star.top}%; left: ${star.left}%; height: ${star.size}px; width: ${star.size}px`}
		/>
	{/each}
</div>

<style>
	.light {
		background-image: linear-gradient(#1f202322, #42447222, #00000000);
		position: fixed;
		z-index: 998;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		overflow: hidden;
	}
	.star-base {
		background-color: #fff;
		border-radius: 50%;
		position: fixed;
	}

	.light:after,
	.light:before {
		content: '';
		display: block;
		position: absolute;
	}
	.light:before {
		width: 120%;
		height: 120%;
		top: 40%;
		left: -25%;
		background: radial-gradient(
			48.58% 48.58% at 49.96% 59.07%,
			#927cff88 0%,
			rgba(142, 133, 190, 0.4) 43.23%,
			rgba(59, 61, 70, 0) 100%
		);
	}
	.light:after {
		width: 120%;
		height: 100%;
		top: 65%;
		left: 25%;
		background: radial-gradient(
			48.58% 48.58% at 49.96% 59.07%,
			#fff38b 0%,
			rgba(180, 174, 113, 0.45) 38.02%,
			rgba(59, 61, 70, 0) 100%
		);
	}

	.star1 {
		animation: 3s linear 1s infinite alternate twinkle;
	}

	.star2 {
		animation: 4s linear 0s infinite alternate twinkle;
	}

	.star3 {
		animation: 3.5s linear 0.5s infinite alternate twinkle;
	}

	.star4 {
		animation: 1.25s linear 1.5s infinite alternate twinkle;
	}

	.star5 {
		animation: 4s linear 2s infinite alternate twinkle;
	}

	.star6 {
		animation: 2.5s linear 1s infinite alternate twinkle;
	}

	@keyframes twinkle {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
