<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import SoundDrawer from '$lib/components/SoundDrawer.svelte';

	let { children } = $props();

	onMount(() => {
		const requestFullscreen = () => {
			document.documentElement.requestFullscreen?.().catch(() => {});
			document.removeEventListener('click', requestFullscreen);
		};
		// Fullscreen must be triggered by a user gesture; attach to first click
		document.addEventListener('click', requestFullscreen);
		return () => document.removeEventListener('click', requestFullscreen);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<SoundDrawer />

<div class="min-h-screen bg-background text-foreground">
	{#key $page.url.pathname}
		<div in:fade={{ duration: 150, delay: 50 }}>
			{@render children()}
		</div>
	{/key}
</div>
