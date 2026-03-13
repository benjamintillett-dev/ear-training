<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	{#key $page.url.pathname}
		<div in:fade={{ duration: 150, delay: 50 }}>
			{@render children()}
		</div>
	{/key}
</div>
