import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
	plugins: [sveltekit()],
	css: {
		preprocessorOptions: {
			scss: {
				// Vite 3 only speaks the legacy Sass JS API; quiet the deprecations
				// (legacy-js-api from Vite, if-function from Pico in node_modules).
				quietDeps: true,
				silenceDeprecations: ['legacy-js-api', 'if-function'],
			},
		},
	},
	build: {
		minify: 'terser',
	},
};

export default config;
