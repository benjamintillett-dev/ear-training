<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Music, Layers2, Search } from 'lucide-svelte';

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
		<Button class="w-full" size="lg" onclick={() => goto('/melody')}>
			<Music class="size-4" />
			Melodic Practice
		</Button>
		<Button class="w-full" size="lg" variant="secondary" onclick={() => goto('/harmony')}>
			<Layers2 class="size-4" />
			Harmonic Practice
		</Button>
		<Button variant="ghost" class="w-full" size="lg" onclick={() => goto('/explore')}>
			<Search class="size-4" />
			Explore Intervals
		</Button>
	</div>

</div>
