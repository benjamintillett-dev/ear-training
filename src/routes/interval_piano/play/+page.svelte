<script lang="ts">
	import { goto } from '$app/navigation';
	import { game, ALL_INTERVALS } from '$lib/game.svelte.js';
	import { playInterval } from '$lib/audio.js';
	import { createPlayController } from '$lib/play-controller.svelte.js';
	import { Volume2 } from 'lucide-svelte';
	import PianoKeyboard from '$lib/components/PianoKeyboard.svelte';
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
	modes={['interval_piano']}
/>

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 px-3 py-6 md:px-6">

	<ProgressDots />

	<div class="flex flex-col items-center gap-8 w-full">
			<!-- Piano keyboard — full width on mobile -->
			<div class="w-full md:max-w-2xl">
				<PianoKeyboard
					enabledSemitones={game.config.intervals.map((i) => i.semitones)}
					{answered}
					{getState}
					onSelect={(semitones) => ctrl.selectAnswer(String(semitones))}
				/>
			</div>

			<!-- Play button -->
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
	</div>

</div>
