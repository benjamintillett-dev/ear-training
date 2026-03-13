<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { playInterval, playNoteSequence, preloadSampler, stopAll } from '$lib/audio.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ArrowUp, ArrowDown, ArrowUpDown, ChevronLeft, Volume2 } from 'lucide-svelte';
	import type { Direction } from '$lib/game.svelte.js';

	let { data } = $props();
	const interval = $derived(data.interval);

	interface Melody {
		title: string;
		direction: 'up' | 'down';
		bpm: number;
		notes: Array<[number, number]>;
	}

	const MELODIES: Record<number, Melody[]> = {
		1: [
			{
				title: 'Jaws',
				direction: 'up', bpm: 52,
				notes: [[0,2],[1,2],[0,1.5],[1,1.5],[0,1],[1,1],[0,0.75],[1,0.75]],
			},
			{
				title: 'Pink Panther',
				direction: 'up', bpm: 120,
				notes: [[0,0.5],[1,1.5],[0,1],[1,0.5],[6,0.5],[5,0.5],[4,0.5],[1,1],[0,2]],
			},
		],
		2: [
			{
				title: 'Happy Birthday',
				direction: 'up', bpm: 100,
				notes: [[0,0.5],[0,0.5],[2,1],[0,1],[5,1],[4,2]],
			},
			{
				title: 'Frère Jacques',
				direction: 'up', bpm: 100,
				notes: [[0,1],[2,1],[4,1],[0,1],[0,1],[2,1],[4,1],[0,1]],
			},
			{
				title: 'Silent Night',
				direction: 'up', bpm: 66,
				notes: [[0,1.5],[2,0.5],[0,1],[-3,3],[0,1.5],[2,0.5],[0,1],[-3,3]],
			},
		],
		3: [
			{
				title: 'Smoke on the Water',
				direction: 'up', bpm: 112,
				notes: [[0,1],[3,1],[5,2],[0,1],[3,1],[6,0.5],[5,2.5]],
			},
			{
				title: 'Greensleeves',
				direction: 'up', bpm: 76,
				notes: [[0,1],[3,2],[2,1],[0,2],[-2,1],[-5,3],[-3,1],[-2,2],[0,1],[3,2],[2,1],[0,3]],
			},
			{
				title: 'Hey Jude',
				direction: 'down', bpm: 76,
				notes: [[0,1],[-3,2.5],[-3,1],[-5,1],[-7,1],[-8,2]],
			},
		],
		4: [
			{
				title: 'When the Saints Go Marching In',
				direction: 'up', bpm: 120,
				notes: [[0,1],[4,1],[5,1],[7,3],[0,1],[4,1],[5,1],[7,3]],
			},
			{
				title: "For He's a Jolly Good Fellow",
				direction: 'up', bpm: 120,
				notes: [[0,1],[4,2],[7,1],[9,2],[7,1],[7,3],[5,1],[4,2],[7,1],[9,2],[4,3]],
			},
		],
		5: [
			{
				title: 'Here Comes the Bride',
				direction: 'up', bpm: 80,
				notes: [[0,1.5],[0,0.5],[0,1],[5,2],[3,1],[2,1],[0,3]],
			},
			{
				title: 'Amazing Grace',
				direction: 'up', bpm: 80,
				notes: [[0,1],[5,2],[2,1],[5,1],[2,1],[0,2],[-3,1],[0,1],[5,3]],
			},
			{
				title: 'Auld Lang Syne',
				direction: 'up', bpm: 80,
				notes: [[0,1.5],[0,0.5],[5,1],[0,1],[5,1],[2,1],[0,1.5],[-3,0.5],[-5,1],[-3,1],[0,2]],
			},
		],
		6: [
			{
				title: 'The Simpsons Theme',
				direction: 'up', bpm: 160,
				notes: [[0,0.5],[6,0.5],[5,0.5],[4,0.5],[3,0.5],[2,0.5],[0,0.75],[6,0.5],[5,0.75]],
			},
			{
				title: 'Maria (West Side Story)',
				direction: 'up', bpm: 80,
				notes: [[0,1],[6,1],[7,2],[6,0.5],[7,0.5],[6,0.5],[7,2]],
			},
			{
				title: 'Black Sabbath (intro)',
				direction: 'up', bpm: 60,
				notes: [[0,1],[0,1],[0,1],[6,1.5],[7,0.5],[6,2]],
			},
		],
		7: [
			{
				title: 'Star Wars Theme',
				direction: 'up', bpm: 120,
				notes: [[0,0.5],[0,0.5],[0,1.5],[7,0.5],[3,1],[0,1.5],[7,0.5],[3,1],[0,2]],
			},
			{
				title: 'Twinkle Twinkle Little Star',
				direction: 'up', bpm: 110,
				notes: [[0,1],[0,1],[7,1],[7,1],[9,1],[9,1],[7,2],[5,1],[5,1],[4,1],[4,1],[2,1],[2,1],[0,2]],
			},
			{
				title: "Can't Help Falling in Love",
				direction: 'up', bpm: 72,
				notes: [[0,1],[4,2],[7,1],[9,2],[7,1],[7,1],[7,2],[5,1],[4,2]],
			},
		],
		8: [
			{
				title: 'The Entertainer',
				direction: 'up', bpm: 100,
				notes: [[0,0.5],[1,0.5],[3,1],[1,1],[-1,1],[3,1],[-1,1],[-4,2],[0,0.5],[1,0.5],[3,1],[1,1],[-1,1]],
			},
			{
				title: 'To Love Somebody (Bee Gees)',
				direction: 'up', bpm: 80,
				notes: [[0,1],[8,2],[8,1],[7,1],[7,1],[4,1],[4,1],[3,2]],
			},
		],
		9: [
			{
				title: 'My Bonnie Lies Over the Ocean',
				direction: 'up', bpm: 140,
				notes: [[0,1],[9,2],[9,1],[7,1],[4,3],[0,1],[2,2]],
			},
			{
				title: 'Hush Little Baby',
				direction: 'up', bpm: 80,
				notes: [[0,1],[9,2],[9,1],[7,1],[7,1],[4,1],[4,1],[2,2]],
			},
		],
		10: [
			{
				title: 'Somewhere (West Side Story)',
				direction: 'up', bpm: 60,
				notes: [[0,1],[10,3],[12,1],[10,1],[9,1],[7,3],[9,2]],
			},
			{
				title: 'Star Trek Theme',
				direction: 'up', bpm: 80,
				notes: [[0,1],[10,2],[12,1],[7,1],[9,1],[7,2],[5,3]],
			},
		],
		11: [
			{
				title: "Bali Ha'i (South Pacific)",
				direction: 'up', bpm: 72,
				notes: [[0,1],[11,2.5],[12,0.5],[11,1],[12,3],[7,2],[0,1],[11,3]],
			},
			{
				title: 'Take On Me (a-ha)',
				direction: 'up', bpm: 168,
				notes: [[0,1],[-2,1],[0,1],[-2,1],[-3,1],[-5,1],[-7,2],[-5,1],[-3,1],[-2,2]],
			},
		],
		12: [
			{
				title: 'Somewhere Over the Rainbow',
				direction: 'up', bpm: 80,
				notes: [[0,1],[12,2],[10,1],[7,1.5],[5,0.5],[7,1],[5,1],[3,1],[2,1],[3,1],[5,2]],
			},
			{
				title: 'Wilma! (The Flintstones)',
				direction: 'up', bpm: 100,
				notes: [[0,1],[12,2],[9,1],[12,3],[0,1],[12,2],[9,1],[12,3]],
			},
		],
	};

	const melodies = $derived(MELODIES[interval.semitones] ?? []);

	let direction = $state<Direction>('up');
	let playingKey = $state<string | null>(null);

	const directions: { value: Direction; label: string; icon: typeof ArrowUp }[] = [
		{ value: 'up', label: 'Ascending', icon: ArrowUp },
		{ value: 'down', label: 'Descending', icon: ArrowDown },
		{ value: 'both', label: 'Both', icon: ArrowUpDown },
	];

	onMount(async () => {
		await preloadSampler();
		playMain();
	});
	onDestroy(() => stopAll());

	async function playMain() {
		if (playingKey !== null) return;
		playingKey = 'interval';
		if (direction === 'both') {
			await playInterval(interval.semitones, 'up');
			await new Promise((r) => setTimeout(r, 1800));
			await playInterval(interval.semitones, 'down');
			await new Promise((r) => setTimeout(r, 1800));
		} else {
			await playInterval(interval.semitones, direction);
			await new Promise((r) => setTimeout(r, 1800));
		}
		playingKey = null;
	}

	async function playMelody(melody: Melody) {
		if (playingKey !== null) return;
		playingKey = melody.title;
		await playNoteSequence(melody.notes, { bpm: melody.bpm });
		playingKey = null;
	}
</script>

<div class="flex min-h-screen flex-col items-center gap-8 px-6 pt-12 pb-16">

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

	<!-- Player card: direction + play -->
	<div class="w-full max-w-sm rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-4">
		<div class="flex rounded-full border border-border bg-muted p-1 gap-1">
			{#each directions as dir}
				{@const active = direction === dir.value}
				<button
					onclick={() => (direction = dir.value)}
					class="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all
						{active ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}"
				>
					<dir.icon class="size-3.5" />
					{dir.label}
				</button>
			{/each}
		</div>

		<button
			onclick={playMain}
			disabled={playingKey !== null}
			class="size-20 rounded-full border-2 flex items-center justify-center transition-all duration-150
				disabled:opacity-50 disabled:cursor-not-allowed
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
