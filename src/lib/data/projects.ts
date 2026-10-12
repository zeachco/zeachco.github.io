export interface Project {
	name: string;
	href: string;
	description: string;
	flagship?: boolean;
}

export const projects: Project[] = [
	{
		name: 'Phantom Game AI Training',
		href: 'https://zeachco.github.io/phantom-game-ai-training/?game=circuit',
		description:
			'Arcade games where self-learning neural networks compete, live, in the browser. No ML libraries; the training is from scratch. Four games, still going.',
		flagship: true,
	},
	{
		name: 'Cells AI',
		href: 'https://zeachco.github.io/cells-ai/',
		description:
			'Rust survival simulation of cells with trained neural networks, compiled to WebAssembly, running in the browser.',
	},
	{
		name: 'dj-viz',
		href: 'https://github.com/zeachco/dj-viz',
		description:
			'Real-time audio visualizer in Rust/nannou; cross-compiled to Linux, Windows and Raspberry Pi.',
	},
	{
		name: 'N3000',
		href: 'https://github.com/zeachco/n3000',
		description:
			'Crypto trading simulator in Rust: neural price forecasting, a ratatui TUI, and seed/fold benchmarks on recorded ETH/BTC/DOT prices.',
	},
	{
		name: 'sniff_llms',
		href: 'https://github.com/zeachco/sniff_llms',
		description:
			'Passive packet-capture inspector for llama.cpp servers: every request, response and streamed chunk, paired per flow, in a TUI.',
	},
	{
		name: 'Ndax Bot',
		href: 'https://ndax.up.railway.app/',
		description:
			'Rust trading bot: TUI, live/sim/record modes, market recording, hot-reloadable strategies.',
	},
	{
		name: 'stubborn-server',
		href: 'https://github.com/zeachco/stubborn-server',
		description:
			'A Node stub server for mocking. My most-starred project (11★), still in use a decade later.',
	},
	{
		name: 'real-mime-type',
		href: 'https://github.com/zeachco/real-mime-type',
		description: 'MIME types by first bytes, not by extension.',
	},
];

export const moreProjects = [
	'progressive-training',
	'dotfiles',
	'dotfiles-cli',
	'stream-play-client',
	'declarative-forms',
	'css-specs',
	'backend-proxy',
	'massive-line-war',
];
