<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, SCALE_DEGREES } from '$lib/game.svelte.js';
	import { playScaleDegree } from '$lib/audio.js';
	import { createPlayController } from '$lib/play-controller.svelte.js';
	import { Volume2 } from 'lucide-svelte';
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
			if (!round || round.question.type !== 'scale_degree') return;
			await playScaleDegree(round.question.scaleDegree.semitones);
		},
		cooldownMs: 2000,
	});

	function getState(degree: number): 'correct' | 'wrong' | 'neutral' {
		if (!answered) return 'neutral';
		const key = String(degree);
		const correctKey = round.question.type === 'scale_degree'
			? String(round.question.scaleDegree.degree)
			: '';
		if (key === correctKey) return 'correct';
		if (key === round.answer) return 'wrong';
		return 'neutral';
	}
</script>

<HomeButton href="/" />
<StatsDrawer
	items={SCALE_DEGREES.map((d) => ({ key: String(d.degree), name: d.name, shortName: d.shortName }))}
	modes={['scale_degree']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6">

	<ProgressDots />

	<div class="flex flex-col items-center gap-8 w-full">
		<!-- Play button -->
		<div class="flex flex-col items-center gap-3">
			<span class="text-xs text-muted-foreground">C major</span>

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

		<!-- Answer buttons — single row -->
		<div class="flex justify-center gap-2 w-full max-w-md">
			{#each game.config.scaleDegrees as deg}
				{@const state = getState(deg.degree)}
				<button
					onclick={() => ctrl.selectAnswer(String(deg.degree))}
					disabled={answered}
					class="flex-1 max-w-12 aspect-square rounded-xl border-2 transition-all duration-150
						flex items-center justify-center text-lg font-bold
						{state === 'correct'
							? 'border-success bg-success/10 text-success'
							: state === 'wrong'
								? 'border-destructive bg-destructive/10 text-destructive'
								: answered
									? 'border-border bg-background opacity-40 cursor-default'
									: 'border-border bg-background hover:bg-accent cursor-pointer'}"
				>
					{deg.shortName}
				</button>
			{/each}
		</div>
	</div>

</div>
