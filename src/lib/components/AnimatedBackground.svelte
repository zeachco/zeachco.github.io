<div class="gradient-bg">
	<div class="wave"></div>
	<div class="wave"></div>
	<div class="wave"></div>
</div>

<style>
	.gradient-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		pointer-events: none;
		overflow: hidden;
		background: linear-gradient(
			45deg,
			rgba(101, 0, 94, 1) 0%,
			rgba(60, 132, 206, 1) 33%,
			rgba(48, 238, 226, 1) 66%,
			rgba(255, 25, 25, 1) 100%
		);
		background-size: 400% 400%;
		animation: gradient 15s ease infinite;
	}

	@keyframes gradient {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 100%;
		}
		100% {
			background-position: 0% 0%;
		}
	}

	.wave {
		background: rgb(255 255 255 / 25%);
		border-radius: 1000% 1000% 0 0;
		position: absolute;
		width: 200%;
		height: 12em;
		animation: wave 10s -3s linear infinite;
		transform: translate3d(0, 0, 0);
		opacity: 0.8;
		bottom: 0;
		left: 0;
	}

	.wave:nth-of-type(2) {
		bottom: -1.25em;
		animation: wave 18s linear reverse infinite;
		opacity: 0.8;
	}

	.wave:nth-of-type(3) {
		bottom: -2.5em;
		animation: wave 20s -1s reverse linear infinite;
		opacity: 0.9;
	}

	@keyframes wave {
		2% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-25%);
		}
		50% {
			transform: translateX(-50%);
		}
		75% {
			transform: translateX(-25%);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
