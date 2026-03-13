<script lang="ts">
	import { Check, X } from 'lucide-svelte';

	let { shortName, name, state, answered, onclick }: {
		shortName: string;
		name: string;
		state: 'correct' | 'wrong' | 'neutral';
		answered: boolean;
		onclick: () => void;
	} = $props();
</script>

<button
	{onclick}
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
	<span class="text-lg font-bold leading-none">{shortName}</span>
	<span class="text-[10px] opacity-70 leading-tight text-center">{name}</span>
	{#if state === 'correct'}
		<Check class="size-3.5 absolute bottom-2 right-2" />
	{:else if state === 'wrong'}
		<X class="size-3.5 absolute bottom-2 right-2" />
	{/if}
</button>
