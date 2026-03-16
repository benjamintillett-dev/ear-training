import { goto } from '$app/navigation';
import { onMount, onDestroy } from 'svelte';
import { game } from '$lib/game.svelte.js';
import { preloadSampler, stopAll } from '$lib/audio.js';

export function createPlayController(opts: {
	playFn: () => Promise<void>;
	cooldownMs?: number;
}) {
	const cooldownMs = opts.cooldownMs ?? 1800;

	let isPlaying = $state(false);
	let isLoading = $state(true);
	let playId = 0;
	let destroyed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function delay(ms: number): Promise<void> {
		return new Promise((r) => {
			timers.push(setTimeout(r, ms));
		});
	}

	async function play() {
		if (!game.rounds[game.currentRound] || destroyed) return;
		const id = ++playId;
		isPlaying = true;
		await opts.playFn();
		await delay(cooldownMs);
		if (playId === id && !destroyed) isPlaying = false;
	}

	async function selectAnswer(key: string) {
		if (destroyed) return;
		const round = game.rounds[game.currentRound];
		if (!round || round.answer !== null) return;
		game.submitAnswer(key);

		await delay(600);
		if (destroyed) return;

		game.nextRound();
		if (game.phase === 'results') goto('/results');
		else {
			stopAll();
			play();
		}
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

	return {
		get isPlaying() {
			return isPlaying;
		},
		get isLoading() {
			return isLoading;
		},
		play,
		selectAnswer,
	};
}
