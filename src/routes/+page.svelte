<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Music, Music2, Piano, Layers2, Hash, Search } from 'lucide-svelte';

	// If returning home from a session, reset state
	$effect(() => {
		if (game.phase !== 'config') game.reset();
	});
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Ear Training</h1>
		<p class="mt-1 text-sm text-muted-foreground">Interval recognition</p>
	</div>

	<div class="flex flex-col gap-4 w-full max-w-sm">
		<Button class="w-full" size="lg" onclick={() => goto('/interval')}>
			<Music class="size-4" />
			Interval Practice
		</Button>
		<Button class="w-full" size="lg" variant="secondary" onclick={() => goto('/interval_piano')}>
			<Piano class="size-4" />
			Piano Intervals
		</Button>
		<Button class="w-full" size="lg" variant="secondary" onclick={() => goto('/dyads')}>
			<Layers2 class="size-4" />
			Dyads
		</Button>
		<Button class="w-full" size="lg" variant="secondary" onclick={() => goto('/triads')}>
			<Music2 class="size-4" />
			Triads
		</Button>
		<Button class="w-full" size="lg" variant="secondary" onclick={() => goto('/sevenths')}>
			<Hash class="size-4" />
			7th Chords
		</Button>
		<Button variant="ghost" class="w-full" size="lg" onclick={() => goto('/explore')}>
			<Search class="size-4" />
			Explore Intervals
		</Button>
	</div>

</div>
