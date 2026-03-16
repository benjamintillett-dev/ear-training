<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { game, ALL_INTERVALS } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import ToggleGrid from '$lib/components/ToggleGrid.svelte';
	import StatsDrawer from '$lib/components/StatsDrawer.svelte';

	onMount(() => {
		game.setConfig({ triads: [], seventhChords: [], shellSeventhChords: [] });
	});

	const canStart = $derived(game.config.intervals.length >= 2);

	function start() {
		game.startGame('harmony', '/dyads');
		goto('/harmony/play');
	}
</script>

<HomeButton href="/" />
<StatsDrawer
	items={ALL_INTERVALS.map((i) => ({ key: String(i.semitones), name: i.name, shortName: i.shortName }))}
	modes={['harmony']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Dyad Practice</h1>
		<p class="mt-1 text-sm text-muted-foreground">Two notes played simultaneously</p>
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

		<div class="flex flex-col gap-3 pt-2">
			<Button class="w-full" size="lg" disabled={!canStart} onclick={start}>
				<Play class="size-4" />
				Start
			</Button>
		</div>

	</div>

</div>
