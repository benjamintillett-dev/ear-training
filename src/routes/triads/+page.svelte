<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { game, ALL_TRIADS } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import ToggleGrid from '$lib/components/ToggleGrid.svelte';

	onMount(() => {
		game.setConfig({ intervals: [], seventhChords: [], shellSeventhChords: [] });
	});

	const canStart = $derived(game.config.triads.length >= 2);

	function start() {
		game.startGame('harmony');
		goto('/harmony/play');
	}
</script>

<HomeButton href="/" />

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Triad Practice</h1>
		<p class="mt-1 text-sm text-muted-foreground">Three-note chords</p>
	</div>

	<div class="mx-auto w-full max-w-sm flex flex-col gap-6">

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

		<div class="flex flex-col gap-3 pt-2">
			<Button class="w-full" size="lg" disabled={!canStart} onclick={start}>
				<Play class="size-4" />
				Start
			</Button>
		</div>

	</div>

</div>
