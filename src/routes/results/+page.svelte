<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Check, X, ArrowUp, ArrowDown, RotateCcw } from 'lucide-svelte';

	$effect(() => {
		if (game.phase !== 'results') goto('/');
	});

	const score = $derived(game.getScore());

	function getMessage(s: number) {
		if (s === 10) return 'Perfect!';
		if (s >= 8) return 'Almost there!';
		if (s >= 6) return 'Good effort!';
		return 'Keep practicing!';
	}
</script>

<div class="flex min-h-screen flex-col items-center gap-8 px-6 pt-12 pb-16">

	<!-- Score -->
	<div class="text-center space-y-1">
		<div class="flex items-baseline justify-center gap-1">
			<span class="text-7xl font-bold tabular-nums">{score}</span>
			<span class="text-3xl text-muted-foreground font-medium">/ 10</span>
		</div>
		<p class="text-sm text-muted-foreground">{getMessage(score)}</p>
	</div>

	<!-- Round breakdown -->
	<div class="w-full max-w-sm space-y-2">
		{#each game.rounds as round}
			{@const guessed = !round.correct && round.answer !== null
				? game.config.intervals.find((iv) => iv.semitones === round.answer)
				: null}
			<div class="flex items-center gap-3 rounded-2xl border border-border px-4 py-3">
				<div class="shrink-0 size-9 rounded-xl border border-border bg-muted flex items-center justify-center font-bold text-xs">
					{round.interval.shortName}
				</div>

				<div class="flex-1 flex flex-col gap-0.5">
					<div class="flex items-center gap-1.5 text-sm font-medium">
						{#if round.direction === 'up'}
							<ArrowUp class="size-3 text-muted-foreground shrink-0" />
						{:else}
							<ArrowDown class="size-3 text-muted-foreground shrink-0" />
						{/if}
						{round.interval.name}
					</div>
					{#if guessed}
						<span class="text-muted-foreground text-xs">answered <span class="font-medium text-destructive">{guessed.name}</span></span>
					{/if}
				</div>

				{#if round.correct}
					<Check class="size-4 text-green-500 shrink-0" />
				{:else}
					<X class="size-4 text-destructive shrink-0" />
				{/if}
			</div>
		{/each}
	</div>

	<!-- Actions -->
	<div class="flex flex-col gap-2 w-full max-w-sm">
		<Button class="w-full" onclick={() => { game.startGame(); goto('/practice'); }}>
			<RotateCcw class="size-4" />
			Practice Again
		</Button>
		<Button variant="ghost" class="w-full" onclick={() => { game.reset(); goto('/'); }}>
			Change Settings
		</Button>
	</div>

</div>
