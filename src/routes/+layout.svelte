<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import SoundDrawer from '$lib/components/SoundDrawer.svelte';
	import { initTracker } from '$lib/analytics/tracker.svelte.js';

	let { children } = $props();

	initTracker();

	onMount(() => {
		if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
		const requestFullscreen = () => {
			document.documentElement.requestFullscreen?.().catch(() => {});
			document.removeEventListener('click', requestFullscreen);
		};
		// Fullscreen must be triggered by a user gesture; attach to first click
		document.addEventListener('click', requestFullscreen);

		// Haptic feedback on button taps (Android Chrome)
		const haptic = (e: Event) => {
			if ((e.target as Element)?.closest('button')) navigator.vibrate?.(10);
		};
		document.addEventListener('click', haptic);

		return () => {
			document.removeEventListener('click', requestFullscreen);
			document.removeEventListener('click', haptic);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SoundDrawer />

<div class="min-h-dvh bg-background text-foreground">
	{#key $page.url.pathname}
		<div in:fade={{ duration: 150, delay: 50 }}>
			{@render children()}
		</div>
	{/key}
</div>
