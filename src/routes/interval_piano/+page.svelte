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

	const canStart = $derived(game.config.intervals.length >= 2);

	const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11, 12];
	const BLACK_KEYS = [1, 3, 6, 8, 10];
	const COL: Record<number, number> = {
		0: 1, 2: 3, 4: 5, 5: 7, 7: 9, 9: 11, 11: 13, 12: 15,
		1: 2, 3: 4, 6: 8, 8: 10, 10: 12,
	};
	const DISPLAY: Record<number, string> = { 0: 'U', 12: 'O' };

	function label(s: number) {
		return DISPLAY[s] ?? ALL_INTERVALS.find((i) => i.semitones === s)!.shortName;
	}

	function isSelected(s: number) {
		return game.config.intervals.some((i) => i.semitones === s);
	}

	const RING = '0 0 0 3px #111';

	function whiteStyle(s: number) {
		return isSelected(s) ? `box-shadow: ${RING}; background-color: white;` : '';
	}

	function blackStyle(s: number) {
		const base = isSelected(s)
			? 'background-color: #111; color: white;'
			: 'background-color: #555; color: #aaa; border-color: #666;';
		return isSelected(s) ? `${base} box-shadow: ${RING};` : base;
	}

	function start() {
		game.startGame('interval_piano');
		goto('/interval_piano/play');
	}
</script>

<HomeButton />

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Piano Intervals</h1>
		<p class="mt-1 text-sm text-muted-foreground">Identify intervals on a piano keyboard</p>
	</div>

	<div class="mx-auto w-full max-w-lg flex flex-col gap-6">

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

		<!-- Piano-shaped interval toggle -->
		<div class="flex flex-col gap-2">
			<div class="flex justify-between items-center px-1">
				<span class="text-xs text-muted-foreground">Intervals</span>
				<div class="flex gap-3">
					<button onclick={() => game.setConfig({ intervals: [...ALL_INTERVALS] })} class="text-xs text-muted-foreground hover:text-foreground transition-colors">All</button>
					<button onclick={() => game.setConfig({ intervals: [] })} class="text-xs text-muted-foreground hover:text-foreground transition-colors">None</button>
				</div>
			</div>

			<div class="w-full grid gap-1.5 px-1" style="grid-template-columns: repeat(16, 1fr);">
				<!-- Black keys — row 1 -->
			{#each BLACK_KEYS as s}
					<div style="grid-column: {COL[s]} / span 2; grid-row: 1; height: 64px; padding: 0 4px;">
						<button
							onclick={() => game.toggleInterval(s)}
							class="w-full h-full rounded-2xl border-2 font-bold text-sm transition-all duration-150 cursor-pointer flex items-center justify-center"
							style={blackStyle(s)}
						>
							{label(s)}
						</button>
					</div>
				{/each}

				<!-- White keys — row 2 -->
				{#each WHITE_KEYS as s}
					<div style="grid-column: {COL[s]} / span 2; grid-row: 2; height: 80px; padding: 0 4px;">
						<button
							onclick={() => game.toggleInterval(s)}
							class="w-full h-full rounded-2xl border-2 border-gray-200 bg-gray-100 text-gray-800 font-bold text-sm transition-all duration-150 cursor-pointer flex items-center justify-center hover:bg-gray-200"
							style={whiteStyle(s)}
						>
							{label(s)}
						</button>
					</div>
				{/each}
			</div>
		</div>

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
