<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { playIntervalHarmonic, playTriad } from '$lib/audio.js';
	import { createPlayController } from '$lib/play-controller.svelte.js';
	import { Volume2 } from 'lucide-svelte';
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
			if (!round) return;
			if (round.question.type === 'interval') {
				await playIntervalHarmonic(round.question.interval.semitones);
			} else if (round.question.type === 'chord') {
				await playTriad(round.question.chord.semitones);
			}
		},
		cooldownMs: 2500,
	});

	function getState(key: string): 'correct' | 'wrong' | 'neutral' {
		if (!answered) return 'neutral';
		const correctKey = round.question.type === 'interval'
			? String(round.question.interval.semitones)
			: round.question.type === 'chord'
			? round.question.chord.id
			: String(round.question.scaleDegree.degree);
		if (key === correctKey) return 'correct';
		if (key === round.answer) return 'wrong';
		return 'neutral';
	}
</script>

<HomeButton href="/" />
<StatsDrawer
	items={[
		...game.config.intervals.map((i) => ({ key: String(i.semitones), name: i.name, shortName: i.shortName })),
		...game.config.triads.map((c) => ({ key: c.id, name: c.name, shortName: c.shortName })),
		...game.config.seventhChords.map((c) => ({ key: c.id, name: c.name, shortName: c.shortName })),
		...game.config.shellSeventhChords.map((c) => ({ key: c.id, name: c.name, shortName: c.shortName })),
	]}
	modes={['harmony']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">

	<ProgressDots />

	<div class="flex flex-col items-center gap-8 w-full">
			<!-- Play button -->
			<div class="flex flex-col items-center gap-3">
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
			<div class="flex flex-col items-center gap-4 w-full max-w-sm">
				{#if game.config.intervals.length > 0}
					<div class="flex flex-wrap justify-center gap-3 w-full">
						{#each game.config.intervals as interval}
							<AnswerButton
								shortName={interval.shortName}
								name={interval.name}
								state={getState(String(interval.semitones))}
								{answered}
								onclick={() => ctrl.selectAnswer(String(interval.semitones))}
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
								onclick={() => ctrl.selectAnswer(chord.id)}
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
								onclick={() => ctrl.selectAnswer(chord.id)}
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
								onclick={() => ctrl.selectAnswer(chord.id)}
							/>
						{/each}
					</div>
				{/if}
			</div>
	</div>

</div>
