<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { game } from '$lib/game.svelte.js';
	import { playIntervalHarmonic, playTriad, preloadSampler, stopAll } from '$lib/audio.js';
	import { Volume2 } from 'lucide-svelte';
import HomeButton from '$lib/components/HomeButton.svelte';
	import AnswerButton from '$lib/components/AnswerButton.svelte';

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

	function playKey(key: string) {
		const n = parseInt(key);
		if (!isNaN(n)) {
			playIntervalHarmonic(n);
		} else {
			const chord = [
				...game.config.triads,
				...game.config.seventhChords,
				...game.config.shellSeventhChords
			].find(c => c.id === key);
			if (chord) playTriad(chord.semitones);
		}
	}

	async function play() {
		if (!round || destroyed) return;
		const id = ++playId;
		isPlaying = true;
		if (round.question.type === 'interval') {
			await playIntervalHarmonic(round.question.interval.semitones);
		} else {
			await playTriad(round.question.chord.semitones);
		}
		await new Promise<void>((r) => { timers.push(setTimeout(r, 2500)); });
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

	async function selectAnswer(key: string) {
		if (answered || destroyed) return;
		game.submitAnswer(key);

		await delay(600);
		if (destroyed) return;

		game.nextRound();
		if (game.phase === 'results') goto('/results');
		else { stopAll(); play(); }
	}

	function getState(key: string): 'correct' | 'wrong' | 'neutral' {
		if (!answered) return 'neutral';
		const correctKey = round.question.type === 'interval'
			? String(round.question.interval.semitones)
			: round.question.chord.id;
		if (key === correctKey) return 'correct';
		if (key === round.answer) return 'wrong';
		return 'neutral';
	}
</script>

<HomeButton />

<div class="flex min-h-screen flex-col items-center justify-center gap-8 p-6">

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
			<!-- Play button -->
			<div class="flex flex-col items-center gap-3">
				<button
					onclick={play}
					disabled={isPlaying || isLoading || answered}
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

			<!-- Answer buttons -->
			<div class="flex flex-col items-center gap-4 w-full max-w-sm">
				{#if game.config.intervals.length > 0}
					<div class="flex flex-wrap justify-center gap-3 w-full">
						{#each game.config.intervals as interval}
							<AnswerButton
								shortName={interval.shortName}
								name={interval.name}
								state={getState(String(interval.semitones))}
								{answered}
								onclick={() => selectAnswer(String(interval.semitones))}
							/>
						{/each}
					</div>
				{/if}

				{#if game.config.triads.length > 0}
					{#if game.config.intervals.length > 0}
						<div class="w-full border-t border-border"></div>
					{/if}
					<div class="flex flex-wrap justify-center gap-3 w-full">
						{#each game.config.triads as chord}
							<AnswerButton
								shortName={chord.shortName}
								name={chord.name}
								state={getState(chord.id)}
								{answered}
								onclick={() => selectAnswer(chord.id)}
							/>
						{/each}
					</div>
				{/if}

				{#if game.config.seventhChords.length > 0}
					{#if game.config.intervals.length > 0 || game.config.triads.length > 0}
						<div class="w-full border-t border-border"></div>
					{/if}
					<div class="flex flex-wrap justify-center gap-3 w-full">
						{#each game.config.seventhChords as chord}
							<AnswerButton
								shortName={chord.shortName}
								name={chord.name}
								state={getState(chord.id)}
								{answered}
								onclick={() => selectAnswer(chord.id)}
							/>
						{/each}
					</div>
				{/if}
				{#if game.config.shellSeventhChords.length > 0}
					{#if game.config.intervals.length > 0 || game.config.triads.length > 0 || game.config.seventhChords.length > 0}
						<div class="w-full border-t border-border"></div>
					{/if}
					<div class="flex flex-wrap justify-center gap-3 w-full">
						{#each game.config.shellSeventhChords as chord}
							<AnswerButton
								shortName={chord.shortName}
								name={chord.name}
								state={getState(chord.id)}
								{answered}
								onclick={() => selectAnswer(chord.id)}
							/>
						{/each}
					</div>
				{/if}
			</div>
	</div>

</div>
