import adapterGhpages from 'svelte-adapter-ghpages';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapterGhpages({
			// default options are shown
			pages: 'docs',
			assets: 'docs',
			fallback: null,
		}),
	},
};

export default config;
