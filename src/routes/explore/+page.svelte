<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { ALL_INTERVALS } from '$lib/game.svelte.js';
	import { preloadSampler } from '$lib/audio.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ChevronLeft } from 'lucide-svelte';

	onMount(() => preloadSampler());
</script>

<div class="flex min-h-dvh flex-col items-center gap-8 p-6">

	<div class="w-full max-w-sm sticky top-0 bg-background/80 backdrop-blur-sm pt-2 pb-3 z-10">
		<Button variant="ghost" size="default" onclick={() => goto('/')}>
			<ChevronLeft class="size-4" /> Back
		</Button>
	</div>

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Explore Intervals</h1>
		<p class="mt-1 text-sm text-muted-foreground">Select an interval to explore</p>
	</div>

	<div class="grid grid-cols-4 gap-3 w-full max-w-sm">
		{#each ALL_INTERVALS as interval}
			<button
				onclick={() => goto(`/explore/${interval.semitones}`)}
				class="aspect-square rounded-2xl border-2 border-border bg-background text-foreground
					transition-all duration-150 cursor-pointer hover:bg-accent
					flex flex-col items-center justify-center gap-0.5 px-1"
			>
				<span class="text-sm font-bold leading-none">{interval.shortName}</span>
				<span class="text-[9px] text-muted-foreground leading-tight text-center px-1">{interval.name}</span>
			</button>
		{/each}
	</div>

</div>
