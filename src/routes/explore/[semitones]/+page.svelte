<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { playInterval, playNoteSequence, preloadSampler, stopAll } from '$lib/audio.js';
	import { MELODIES, type Melody } from '$lib/melodies.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowUp, ArrowDown, ChevronLeft, Volume2 } from 'lucide-svelte';

	let { data } = $props();
	const interval = $derived(data.interval);

	const melodies = $derived(MELODIES[interval.semitones] ?? []);

	let playingKey = $state<string | null>(null);

	onMount(async () => {
		await preloadSampler();
		playMain();
	});
	onDestroy(() => stopAll());

	async function playMain() {
		if (playingKey !== null) return;
		playingKey = 'interval';
		await playInterval(interval.semitones, 'up');
		await new Promise((r) => setTimeout(r, 1800));
		playingKey = null;
	}

	async function playMelody(melody: Melody) {
		if (playingKey !== null) return;
		playingKey = melody.title;
		await playNoteSequence(melody.notes, { bpm: melody.bpm });
		playingKey = null;
	}
</script>

<div class="flex min-h-dvh flex-col items-center gap-8 p-6">

	<!-- Back -->
	<div class="w-full max-w-sm sticky top-0 bg-background/80 backdrop-blur-sm pt-2 pb-3 z-10">
		<Button variant="ghost" size="default" onclick={() => goto('/explore')}>
			<ChevronLeft class="size-4" /> All Intervals
		</Button>
	</div>

	<!-- Interval header -->
	<div class="flex flex-col items-center gap-2">
		<div class="size-20 rounded-3xl border-2 border-border bg-muted flex items-center justify-center text-2xl font-bold">
			{interval.shortName}
		</div>
		<p class="text-muted-foreground text-sm">{interval.name}</p>
	</div>

	<!-- Player card -->
	<div class="w-full max-w-sm rounded-2xl border-2 border-border bg-card p-5 flex flex-col items-center gap-4">
		<button
			onclick={playMain}
			disabled={playingKey !== null}
			class="size-20 rounded-full border-2 flex items-center justify-center transition-all duration-150
				disabled:opacity-40 disabled:cursor-not-allowed
				{playingKey === 'interval'
					? 'border-primary bg-primary text-primary-foreground'
					: 'border-border bg-background hover:bg-accent'}"
		>
			<Volume2 class="size-7" />
		</button>
	</div>

	<!-- Melodies -->
	<div class="w-full max-w-sm space-y-2">
		<p class="text-xs text-muted-foreground px-1">Melodies that open with this interval</p>
		{#each melodies as melody}
			{@const isPlaying = playingKey === melody.title}
			<button
				onclick={() => playMelody(melody)}
				disabled={playingKey !== null}
				class="w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-150
					{isPlaying
						? 'border-primary bg-primary text-primary-foreground'
						: playingKey !== null
							? 'border-border bg-background opacity-40 cursor-not-allowed'
							: 'border-border bg-background hover:bg-accent cursor-pointer'}"
			>
				{#if melody.direction === 'up'}
					<ArrowUp class="size-3.5 shrink-0 text-muted-foreground {isPlaying ? 'text-primary-foreground' : ''}" />
				{:else}
					<ArrowDown class="size-3.5 shrink-0 text-muted-foreground {isPlaying ? 'text-primary-foreground' : ''}" />
				{/if}
				<span class="text-sm font-medium flex-1">{melody.title}</span>
				<Volume2 class="size-3.5 shrink-0 opacity-50" />
			</button>
		{/each}
	</div>

</div>
