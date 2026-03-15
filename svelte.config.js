import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			entries: [
				'*',
				...Array.from({ length: 12 }, (_, i) => `/explore/${i + 1}`)
			]
		}
	}
};

export default config;
