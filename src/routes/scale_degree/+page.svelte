<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, SCALE_DEGREES } from '$lib/game.svelte.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Play } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import StatsDrawer from '$lib/components/StatsDrawer.svelte';
	import ToggleGrid from '$lib/components/ToggleGrid.svelte';

	const canStart = $derived(game.config.scaleDegrees.length >= 2);

	function start() {
		game.startGame('scale_degree', '/scale_degree');
		goto('/scale_degree/play');
	}
</script>

<HomeButton href="/" />
<StatsDrawer
	items={SCALE_DEGREES.map((d) => ({ key: String(d.degree), name: d.name, shortName: d.shortName }))}
	modes={['scale_degree']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">

	<div class="text-center">
		<h1 class="text-2xl font-semibold tracking-tight">Scale Degrees</h1>
		<p class="mt-1 text-sm text-muted-foreground">Identify notes in C major</p>
	</div>

	<div class="mx-auto w-full max-w-sm flex flex-col gap-6">

		<ToggleGrid
			label="Degrees"
			items={SCALE_DEGREES.map((d) => ({
				shortName: d.shortName,
				selected: game.config.scaleDegrees.some((x) => x.degree === d.degree),
				onToggle: () => game.toggleScaleDegree(d.degree),
			}))}
			onAll={() => game.setConfig({ scaleDegrees: [...SCALE_DEGREES] })}
			onNone={() => game.setConfig({ scaleDegrees: [] })}
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
