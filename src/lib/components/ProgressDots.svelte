<script lang="ts">
	import { game } from '$lib/game.svelte.js';
</script>

<div class="flex gap-2">
	{#each Array(10) as _, i}
		{@const r = game.rounds[i]}
		<div
			class="size-2 rounded-full transition-colors duration-300
				{i < game.currentRound
					? (r?.correct ? 'bg-success' : 'bg-destructive')
					: i === game.currentRound
						? 'bg-foreground'
						: 'bg-border'}"
		></div>
	{/each}
</div>
