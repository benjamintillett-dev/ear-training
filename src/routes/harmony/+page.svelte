<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS, ALL_TRIADS, ALL_SEVENTH_CHORDS, ALL_SHELL_SEVENTH_CHORDS } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import ToggleGrid from '$lib/components/ToggleGrid.svelte';

	const canStart = $derived(
		game.config.intervals.length + game.config.triads.length + game.config.seventhChords.length + game.config.shellSeventhChords.length >= 2
	);

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

		<ToggleGrid
			label="Intervals"
			items={ALL_INTERVALS.map((i) => ({
				shortName: i.shortName,
				selected: game.config.intervals.some((x) => x.semitones === i.semitones),
				onToggle: () => game.toggleInterval(i.semitones),
			}))}
			onAll={() => game.setConfig({ intervals: [...ALL_INTERVALS] })}
			onNone={() => game.setConfig({ intervals: [] })}
		/>

		<ToggleGrid
			label="Triads (C)"
			items={ALL_TRIADS.map((t) => ({
				shortName: t.shortName,
				selected: game.config.triads.some((x) => x.id === t.id),
				onToggle: () => game.toggleTriad(t.id),
			}))}
			onAll={() => game.setConfig({ triads: [...ALL_TRIADS] })}
			onNone={() => game.setConfig({ triads: [] })}
		/>

		<ToggleGrid
			label="7th Chords — Shell (C)"
			items={ALL_SHELL_SEVENTH_CHORDS.map((c) => ({
				shortName: c.shortName,
				selected: game.config.shellSeventhChords.some((x) => x.id === c.id),
				onToggle: () => game.toggleShellSeventhChord(c.id),
			}))}
			onAll={() => game.setConfig({ shellSeventhChords: [...ALL_SHELL_SEVENTH_CHORDS] })}
			onNone={() => game.setConfig({ shellSeventhChords: [] })}
		/>

		<ToggleGrid
			label="7th Chords — Full (C)"
			items={ALL_SEVENTH_CHORDS.map((c) => ({
				shortName: c.shortName,
				selected: game.config.seventhChords.some((x) => x.id === c.id),
				onToggle: () => game.toggleSeventhChord(c.id),
			}))}
			onAll={() => game.setConfig({ seventhChords: [...ALL_SEVENTH_CHORDS] })}
			onNone={() => game.setConfig({ seventhChords: [] })}
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
