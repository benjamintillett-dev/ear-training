<script lang="ts">
	import { goto } from '$app/navigation';
	import { stopAll } from '$lib/audio.js';
	import { House } from 'lucide-svelte';

	let { href }: { href?: string } = $props();

	function handleClick() {
		stopAll();
		if (href) goto(href);
		else history.back();
	}
</script>

<button
	onclick={handleClick}
	class="fixed top-4 z-10 flex items-center border border-border bg-background shadow-sm
		text-muted-foreground hover:text-foreground transition-colors
		{href ? 'right-4 size-10 rounded-full justify-center' : 'left-4 h-8 px-3 rounded-full text-xs'}"
>
	{#if href}
		<House class="size-4" />
	{:else}
		Settings
	{/if}
</button>
