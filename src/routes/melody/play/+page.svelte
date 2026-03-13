<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount, onDestroy } from 'svelte';
	import { game } from '$lib/game.svelte.js';
	import { playInterval, preloadSampler, stopAll } from '$lib/audio.js';
	import { Check, X, Volume2, ArrowUp, ArrowDown } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import { fade } from 'svelte/transition';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const round = $derived(game.rounds[game.currentRound]);
	const answered = $derived(round != null && round.answer !== null);

	let isPlaying = $state(false);
	let isLoading = $state(true);
	let playId = 0;

	async function play() {
		if (!round) return;
		const id = ++playId;
		isPlaying = true;
		const semitones = round.question.type === 'interval' ? round.question.interval.semitones : 0;
		await playInterval(semitones, round.direction);
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
		const correctKey = round.question.type === 'interval' ? String(round.question.interval.semitones) : '';
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

			<!-- Answer buttons -->
			<div class="flex flex-wrap justify-center gap-3 w-full max-w-sm">
				{#each game.config.intervals as interval}
					{@const state = getState(interval.semitones)}
					<button
						onclick={() => selectAnswer(interval.semitones)}
						disabled={answered}
						class="w-28 h-28 rounded-2xl border-2 transition-all duration-200 relative
							flex flex-col items-center justify-center gap-1 px-2
							{state === 'correct'
								? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 scale-105'
								: state === 'wrong'
									? 'border-destructive bg-destructive/10 text-destructive'
									: answered
										? 'border-border bg-background opacity-35 cursor-default'
										: 'border-border bg-background hover:bg-accent cursor-pointer'}"
					>
						<span class="text-lg font-bold leading-none">{interval.shortName}</span>
						<span class="text-[10px] opacity-70 leading-tight text-center">{interval.name}</span>
						{#if state === 'correct'}
							<Check class="size-3.5 absolute bottom-2 right-2" />
						{:else if state === 'wrong'}
							<X class="size-3.5 absolute bottom-2 right-2" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/key}

</div>
