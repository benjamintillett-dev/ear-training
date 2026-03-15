import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			strategies: 'generateSW',
			registerType: 'prompt',
			manifest: {
				name: 'Ear Training',
				short_name: 'Ear Training',
				description: 'Train your musical ear with intervals, chords, and scales',
				theme_color: '#17202e',
				background_color: '#17202e',
				display: 'standalone',
				icons: [
					{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
					{ src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,woff,woff2}'],
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/(smpldsnds\.github\.io|gleitz\.github\.io|goldst\.dev)\/.*/,
						handler: 'CacheFirst',
						options: {
							cacheName: 'audio-samples',
							expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 90 },
							cacheableResponse: { statuses: [0, 200] }
						}
					}
				]
			}
		})
	]
});
