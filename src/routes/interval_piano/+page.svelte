<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS, type Direction } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowUp, ArrowDown, ArrowUpDown, Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import ToggleGrid from '$lib/components/ToggleGrid.svelte';

	const directions: { value: Direction; label: string; icon: typeof ArrowUp }[] = [
		{ value: 'up', label: 'Ascending', icon: ArrowUp },
		{ value: 'down', label: 'Descending', icon: ArrowDown },
		{ value: 'both', label: 'Both', icon: ArrowUpDown },
	];

	const canStart = $derived(game.config.intervals.length >= 2);

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

		<ToggleGrid
			label="Intervals"
			items={ALL_INTERVALS.map((i) => ({
				shortName: i.semitones === 0 ? 'U' : i.semitones === 12 ? 'O' : i.shortName,
				selected: game.config.intervals.some((x) => x.semitones === i.semitones),
				onToggle: () => game.toggleInterval(i.semitones),
			}))}
			onAll={() => game.setConfig({ intervals: [...ALL_INTERVALS] })}
			onNone={() => game.setConfig({ intervals: [] })}
		/>

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
