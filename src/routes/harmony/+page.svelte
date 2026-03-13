<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS, ALL_TRIADS, ALL_SEVENTH_CHORDS } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

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

	function toggleTriad(id: string) {
		const selected = game.config.triads;
		const exists = selected.some((t) => t.id === id);
		const triad = ALL_TRIADS.find((t) => t.id === id)!;
		if (exists) {
			game.setConfig({ triads: selected.filter((t) => t.id !== id) });
		} else {
			game.setConfig({ triads: [...selected, triad] });
		}
	}

	function toggleSeventhChord(id: string) {
		const selected = game.config.seventhChords;
		const exists = selected.some((t) => t.id === id);
		const chord = ALL_SEVENTH_CHORDS.find((t) => t.id === id)!;
		if (exists) {
			game.setConfig({ seventhChords: selected.filter((t) => t.id !== id) });
		} else {
			game.setConfig({ seventhChords: [...selected, chord] });
		}
	}

	const totalSelected = $derived(game.config.intervals.length + game.config.triads.length + game.config.seventhChords.length);
	const canStart = $derived(totalSelected >= 2);

	function start() {
		game.startGame('harmony');
		goto('/harmony/play');
	}
</script>

<HomeButton />

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Harmonic Practice</h1>
		<p class="mt-1 text-sm text-muted-foreground">Intervals played simultaneously</p>
	</div>

	<div class="mx-auto w-full max-w-sm flex flex-col gap-6">

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

		<!-- Triads -->
		<div class="flex flex-col gap-2">
			<div class="flex justify-between items-center px-1">
				<span class="text-xs text-muted-foreground">Triads (C)</span>
				<div class="flex gap-3">
					<button
						onclick={() => game.setConfig({ triads: [...ALL_TRIADS] })}
						class="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>All</button>
					<button
						onclick={() => game.setConfig({ triads: [] })}
						class="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>None</button>
				</div>
			</div>
			<div class="grid grid-cols-4 gap-3">
				{#each ALL_TRIADS as triad}
					{@const selected = game.config.triads.some((t) => t.id === triad.id)}
					<button
						onclick={() => toggleTriad(triad.id)}
						class="aspect-square rounded-2xl border-2 font-bold text-sm transition-all duration-150 cursor-pointer
							{selected
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-border bg-background text-foreground hover:bg-accent'}"
					>
						{triad.shortName}
					</button>
				{/each}
			</div>
		</div>

		<!-- 7th Chords -->
		<div class="flex flex-col gap-2">
			<div class="flex justify-between items-center px-1">
				<span class="text-xs text-muted-foreground">7th Chords (C)</span>
				<div class="flex gap-3">
					<button
						onclick={() => game.setConfig({ seventhChords: [...ALL_SEVENTH_CHORDS] })}
						class="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>All</button>
					<button
						onclick={() => game.setConfig({ seventhChords: [] })}
						class="text-xs text-muted-foreground hover:text-foreground transition-colors"
					>None</button>
				</div>
			</div>
			<div class="grid grid-cols-4 gap-3">
				{#each ALL_SEVENTH_CHORDS as chord}
					{@const selected = game.config.seventhChords.some((t) => t.id === chord.id)}
					<button
						onclick={() => toggleSeventhChord(chord.id)}
						class="aspect-square rounded-2xl border-2 font-bold text-sm transition-all duration-150 cursor-pointer
							{selected
								? 'border-primary bg-primary text-primary-foreground'
								: 'border-border bg-background text-foreground hover:bg-accent'}"
					>
						{chord.shortName}
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
