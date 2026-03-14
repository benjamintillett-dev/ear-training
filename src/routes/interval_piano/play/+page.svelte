<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { game } from '$lib/game.svelte.js';
	import { playInterval, preloadSampler, stopAll } from '$lib/audio.js';
	import { Volume2 } from 'lucide-svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const round = $derived(game.rounds[game.currentRound]);
	const answered = $derived(round != null && round.answer !== null);

	let isPlaying = $state(false);
	let isLoading = $state(true);
	let playId = 0;
	let destroyed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function delay(ms: number): Promise<void> {
		return new Promise((r) => { timers.push(setTimeout(r, ms)); });
	}

	async function play() {
		if (!round || round.question.type !== 'interval' || destroyed) return;
		const id = ++playId;
		isPlaying = true;
		await playInterval(round.question.interval.semitones, round.direction);
		await new Promise<void>((r) => { timers.push(setTimeout(r, 1800)); });
		if (playId === id && !destroyed) isPlaying = false;
	}

	onMount(async () => {
		await preloadSampler();
		isLoading = false;
		play();
	});

	onDestroy(() => {
		destroyed = true;
		stopAll();
		timers.forEach(clearTimeout);
	});

	async function selectAnswer(semitones: number) {
		if (answered || destroyed) return;
		game.submitAnswer(String(semitones));

		await delay(600);
		if (destroyed) return;

		game.nextRound();
		if (game.phase === 'results') goto('/results');
		else { stopAll(); play(); }
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

<HomeButton href="/" />

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

	<div class="flex flex-col items-center gap-8 w-full">
			<!-- Piano keyboard — full width on mobile -->
			<div class="w-full md:max-w-2xl">
				<PianoKeyboard
					enabledSemitones={game.config.intervals.map((i) => i.semitones)}
					{answered}
					{getState}
					onSelect={selectAnswer}
				/>
			</div>

			<!-- Play button -->
			<button
				onclick={play}
				disabled={isPlaying || isLoading || answered}
				class="size-20 rounded-full border-2 flex items-center justify-center transition-all
					{isPlaying
						? 'border-primary bg-primary text-primary-foreground'
						: 'border-border bg-background hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'}"
			>
				<Volume2 class="size-8" />
			</button>
	</div>

</div>
