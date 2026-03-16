<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS } from '$lib/game.svelte.js';
	import { playInterval } from '$lib/audio.js';
	import { createPlayController } from '$lib/play-controller.svelte.js';
	import { Volume2, ArrowUp, ArrowDown } from 'lucide-svelte';
	import AnswerButton from '$lib/components/AnswerButton.svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';
	import StatsDrawer from '$lib/components/StatsDrawer.svelte';
	import ProgressDots from '$lib/components/ProgressDots.svelte';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const round = $derived(game.rounds[game.currentRound]);
	const answered = $derived(round != null && round.answer !== null);

	const ctrl = createPlayController({
		playFn: async () => {
			if (!round || round.question.type !== 'interval') return;
			await playInterval(round.question.interval.semitones, round.direction);
		},
	});

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
<StatsDrawer
	items={ALL_INTERVALS.map((i) => ({ key: String(i.semitones), name: i.name, shortName: i.shortName }))}
	modes={['interval']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">

	<ProgressDots />

	<div class="flex flex-col items-center gap-8 w-full">
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
					onclick={ctrl.play}
					disabled={ctrl.isPlaying || ctrl.isLoading || answered}
					class="size-20 rounded-full border-2 flex items-center justify-center transition-all
						{ctrl.isPlaying
							? 'border-primary bg-primary text-primary-foreground'
							: 'border-border bg-background hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed'}"
				>
					<Volume2 class="size-8" />
				</button>

				<span class="text-xs text-muted-foreground">
					{ctrl.isLoading ? 'Loading…' : ctrl.isPlaying ? 'Playing…' : 'Tap to replay'}
				</span>
			</div>

			<!-- Answer buttons -->
			<div class="flex flex-wrap justify-center gap-3 w-full max-w-sm">
				{#each game.config.intervals as interval}
					<AnswerButton
						shortName={interval.shortName}
						name={interval.name}
						state={getState(interval.semitones)}
						{answered}
						onclick={() => ctrl.selectAnswer(String(interval.semitones))}
					/>
				{/each}
			</div>
	</div>

</div>
