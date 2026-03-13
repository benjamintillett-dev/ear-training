<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS, type Direction } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowUp, ArrowDown, ArrowUpDown, Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

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

	const canStart = $derived(game.config.intervals.length >= 2);

	function start() {
		game.startGame('melody');
		goto('/melody/play');
	}
</script>

<HomeButton />

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Melodic Practice</h1>
		<p class="mt-1 text-sm text-muted-foreground">Intervals played sequentially</p>
	</div>

	<div class="mx-auto w-full max-w-sm flex flex-col gap-6">

		<!-- Direction -->
		<div class="flex flex-col gap-2">
			<span class="text-xs text-muted-foreground px-1">Direction</span>
			<div class="flex rounded-full border border-border bg-muted p-1 gap-1">
				{#each directions as dir}
					{@const active = game.config.direction === dir.value}
					<button
						onclick={() => game.setConfig({ direction: dir.value })}
						class="flex-1 flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition-all
							{active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
					>
						<dir.icon class="size-3.5" />
						{dir.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Intervals -->
		<div class="flex flex-col gap-2">
			<div class="flex justify-between items-center px-1">
				<span class="text-xs text-muted-foreground">Intervals</span>
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
		<div class="flex flex-col gap-3 pt-2">
			<Button class="w-full" size="lg" disabled={!canStart} onclick={start}>
				<Play class="size-4" />
				Start
			</Button>
			<Button variant="ghost" class="w-full" size="lg" onclick={() => goto('/')}>
				Home
			</Button>
		</div>

	</div>

</div>
