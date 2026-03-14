<script lang="ts">
	import { Check, X } from 'lucide-svelte';
	import { ALL_INTERVALS } from '$lib/game.svelte.js';

	interface Props {
		enabledSemitones: number[];
		answered: boolean;
		getState: (s: number) => 'correct' | 'wrong' | 'neutral';
		onSelect: (s: number) => void;
	}

	let { enabledSemitones, answered, getState, onSelect }: Props = $props();

	// 16-column grid: each white key spans 2 cols, black keys span 2 cols centered in the gap
	const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11, 12];
	const BLACK_KEYS = [1, 3, 6, 8, 10];

	// grid-column start (1-indexed) for each semitone
	const COL: Record<number, number> = {
		// white keys
		0: 1, 2: 3, 4: 5, 5: 7, 7: 9, 9: 11, 11: 13, 12: 15,
		// black keys (centered in gaps between adjacent white keys)
		1: 2, 3: 4, 6: 8, 8: 10, 10: 12,
	};

	function info(s: number) {
		return ALL_INTERVALS.find((i) => i.semitones === s)!;
	}

	const DISPLAY_SHORT: Record<number, string> = { 0: 'U', 12: 'O' };

	function btnClass(s: number, isBlack: boolean): string {
		const state = getState(s);
		const enabled = enabledSemitones.includes(s);

		const base = 'w-full h-full rounded-2xl border-2 transition-all duration-150 relative flex flex-col items-center justify-center gap-0.5 px-1';

		if (state === 'correct') return `${base} border-success bg-success/10 text-success`;
		if (state === 'wrong')   return `${base} border-destructive bg-destructive/10 text-destructive`;
		if (!enabled)            return `${base} cursor-not-allowed`;
		if (isBlack) {
			if (answered) return `${base} border-transparent opacity-40 cursor-default`;
			return `${base} border-transparent cursor-pointer`;
		}
		if (answered) return `${base} border-border bg-card opacity-40 cursor-default`;
		return `${base} border-border bg-card hover:bg-accent cursor-pointer`;
	}

	function btnStyle(s: number, isBlack: boolean): string {
		const state = getState(s);
		const enabled = enabledSemitones.includes(s);
		if (state === 'correct' || state === 'wrong') return '';
		if (!enabled) return 'background-color: #1e293b; color: #334155; border-color: #1e293b;';
		if (!isBlack) return '';
		return 'background-color: #0f172a; color: #94a3b8; border-color: #334155;';
	}
</script>

<div class="w-full grid gap-1.5" style="grid-template-columns: repeat(16, 1fr);">
	<!-- Black keys — row 1, with horizontal padding to make them narrower -->
	{#each BLACK_KEYS as s}
		{@const i = info(s)}
		{@const state = getState(s)}
		{@const enabled = enabledSemitones.includes(s)}
		<div style="grid-column: {COL[s]} / span 2; grid-row: 1; height: 72px; padding: 0 4px;">
			<button
				class={btnClass(s, true)}
				style={btnStyle(s, true)}
				onclick={() => { if (enabled && !answered) onSelect(s); }}
			>
				{#if enabled}
					<span class="text-sm font-bold leading-none">{DISPLAY_SHORT[s] ?? i.shortName}</span>
				{/if}
				{#if state === 'correct'}
					<Check class="size-3 absolute bottom-1 right-1" />
				{:else if state === 'wrong'}
					<X class="size-3 absolute bottom-1 right-1" />
				{/if}
			</button>
		</div>
	{/each}

	<!-- White keys — row 2 -->
	{#each WHITE_KEYS as s}
		{@const i = info(s)}
		{@const state = getState(s)}
		{@const enabled = enabledSemitones.includes(s)}
		<div style="grid-column: {COL[s]} / span 2; grid-row: 2; height: 88px;">
			<button
				class={btnClass(s, false)}
				style={btnStyle(s, false)}
				onclick={() => { if (enabled && !answered) onSelect(s); }}
			>
				{#if enabled}
					<span class="text-sm font-bold leading-none">{DISPLAY_SHORT[s] ?? i.shortName}</span>
				{/if}
				{#if state === 'correct'}
					<Check class="size-3 absolute bottom-1 right-1" />
				{:else if state === 'wrong'}
					<X class="size-3 absolute bottom-1 right-1" />
				{/if}
			</button>
		</div>
	{/each}
</div>
