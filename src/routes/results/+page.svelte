<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RotateCcw } from 'lucide-svelte';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const score = $derived(game.getScore());

	function getMessage(s: number) {
		if (s === 10) return 'Perfect!';
		if (s >= 8) return 'Almost there!';
		if (s >= 6) return 'Good effort!';
		return 'Keep practicing!';
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center space-y-1">
		<div class="flex items-baseline justify-center gap-1">
			<span class="text-7xl font-bold tabular-nums">{score}</span>
			<span class="text-3xl text-muted-foreground font-medium">/ 10</span>
		</div>
		<p class="text-sm text-muted-foreground">{getMessage(score)}</p>
	</div>

	<div class="flex flex-col gap-4 w-full max-w-sm">
		<Button class="w-full" size="lg" onclick={() => { game.startGame(); goto('/practice'); }}>
			<RotateCcw class="size-4" />
			Practice Again
		</Button>
		<Button variant="ghost" class="w-full" size="lg" onclick={() => { game.reset(); goto('/'); }}>
			Change Settings
		</Button>
	</div>

</div>
