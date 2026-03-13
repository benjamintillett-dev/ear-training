<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { game } from '$lib/game.svelte.js';
	import { playInterval, preloadSampler, stopAll } from '$lib/audio.js';
	import { Volume2, ArrowUp, ArrowDown } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const round = $derived(game.rounds[game.currentRound]);
	const answered = $derived(round != null && round.answer !== null);

	let isPlaying = $state(false);
	let isLoading = $state(true);
	let playId = 0;

	async function play() {
		if (!round || round.question.type !== 'interval') return;
		const id = ++playId;
		isPlaying = true;
		await playInterval(round.question.interval.semitones, round.direction);
		await new Promise((r) => setTimeout(r, 1800));
		if (playId === id) isPlaying = false;
	}

	onMount(async () => {
		await preloadSampler();
		isLoading = false;
		play();
	});

	onDestroy(() => stopAll());

	function selectAnswer(semitones: number) {
		if (answered) return;
		game.submitAnswer(String(semitones));
		setTimeout(() => {
			game.nextRound();
			if (game.phase === 'results') goto('/results');
			else {
				stopAll();
				play();
			}
		}, 700);
	}

	function getState(semitones: number): 'correct' | 'wrong' | 'neutral' {
		if (!answered) return 'neutral';
		const key = String(semitones);
		const correctKey = round.question.type === 'interval'
			? String(round.question.interval.semitones)
			: '';
		if (key === correctKey) return 'correct';
		if (key === round.answer) return 'wrong';
		return 'neutral';
	}
</script>

<HomeButton />

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6 px-3 md:px-6">

	<!-- Progress dots -->
	<div class="flex gap-2">
		{#each Array(10) as _, i}
			{@const r = game.rounds[i]}
			<div
				class="size-2 rounded-full transition-colors duration-300
					{i < game.currentRound
						? (r?.correct ? 'bg-green-500' : 'bg-destructive')
						: i === game.currentRound
							? 'bg-foreground'
							: 'bg-border'}"
			></div>
		{/each}
	</div>

	{#key game.currentRound}
		<div
			class="flex flex-col items-center gap-8 w-full"
			in:fade={{ duration: 200, delay: 50 }}
		>
			<!-- Play button -->
			<div class="flex flex-col items-center gap-3">
				<div class="flex items-center gap-1.5 text-muted-foreground text-xs">
					{#if round?.direction === 'up'}
						<ArrowUp class="size-3" />
						<span>Ascending</span>
					{:else}
						<ArrowDown class="size-3" />
						<span>Descending</span>
					{/if}
				</div>

				<button
					onclick={play}
					disabled={isPlaying || isLoading}
					class="size-28 rounded-full border-2 flex items-center justify-center transition-all
						{isPlaying
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'}"
				>
					<Volume2 class="size-10" />
				</button>

				<span class="text-xs text-muted-foreground">
					{isLoading ? 'Loading…' : isPlaying ? 'Playing…' : 'Tap to replay'}
				</span>
			</div>

			<!-- Piano keyboard — full width on mobile -->
			<div class="w-full md:max-w-2xl">
				<PianoKeyboard
					enabledSemitones={game.config.intervals.map((i) => i.semitones)}
					{answered}
					{getState}
					onSelect={selectAnswer}
				/>
			</div>
		</div>
	{/key}

</div>
