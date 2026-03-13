<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS, type Direction } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowUp, ArrowDown, ArrowUpDown, Play, Search } from 'lucide-svelte';

	const directions: { value: Direction; label: string; icon: typeof ArrowUp }[] = [
		{ value: 'up', label: 'Ascending', icon: ArrowUp },
		{ value: 'down', label: 'Descending', icon: ArrowDown },
		{ value: 'both', label: 'Both', icon: ArrowUpDown },
	];

	function toggleInterval(semitones: number) {
		const selected = game.config.intervals;
		const exists = selected.some((i) => i.semitones === semitones);
		const interval = ALL_INTERVALS.find((i) => i.semitones === semitones)!;
		if (exists) {
			game.setConfig({ intervals: selected.filter((i) => i.semitones !== semitones) });
		} else {
			game.setConfig({ intervals: [...selected, interval].sort((a, b) => a.semitones - b.semitones) });
		}
	}

	function start() {
		game.startGame();
		goto('/practice');
	}

	const canStart = $derived(game.config.intervals.length >= 2);
</script>

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Ear Training</h1>
		<p class="mt-1 text-sm text-muted-foreground">Interval recognition</p>
	</div>

	<!-- Direction -->
	<div class="flex rounded-full border border-border bg-muted p-1 gap-1">
		{#each directions as dir}
			{@const active = game.config.direction === dir.value}
			<button
				onclick={() => game.setConfig({ direction: dir.value })}
				class="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all
					{active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
			>
				<dir.icon class="size-3.5" />
				{dir.label}
			</button>
		{/each}
	</div>

	<!-- Intervals -->
	<div class="w-full max-w-sm space-y-3">
		<div class="flex justify-between items-center px-1">
			<span class="text-xs text-muted-foreground">Select ≥ 2 intervals</span>
			<div class="flex gap-3">
				<button
					onclick={() => game.setConfig({ intervals: [...ALL_INTERVALS] })}
					class="text-xs text-muted-foreground hover:text-foreground transition-colors"
				>All</button>
				<button
					onclick={() => game.setConfig({ intervals: [] })}
					class="text-xs text-muted-foreground hover:text-foreground transition-colors"
				>None</button>
			</div>
		</div>
		<div class="grid grid-cols-4 gap-3">
			{#each ALL_INTERVALS as interval}
				{@const selected = game.config.intervals.some((i) => i.semitones === interval.semitones)}
				<button
					onclick={() => toggleInterval(interval.semitones)}
					class="aspect-square rounded-2xl border-2 font-bold text-sm transition-all duration-150 cursor-pointer
						{selected
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-border bg-background text-foreground hover:bg-accent'}"
				>
					{interval.shortName}
				</button>
			{/each}
		</div>
	</div>

	<!-- Actions -->
	<div class="flex flex-col gap-4 w-full max-w-sm">
		<Button class="w-full" size="lg" disabled={!canStart} onclick={start}>
			<Play class="size-4" />
			Start
		</Button>
		<Button variant="ghost" class="w-full" size="lg" onclick={() => goto('/explore')}>
			<Search class="size-4" />
			Explore Intervals
		</Button>
	</div>

</div>
