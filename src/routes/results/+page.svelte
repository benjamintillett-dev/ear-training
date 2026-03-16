<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/ui/button/index.js';
	import { RotateCcw, Settings, Home } from 'lucide-svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

	$effect(() => {
		if (game.phase === 'config') goto('/');
	});

	const score = $derived(game.getScore());
	const mode = $derived(game.config.mode);

	const settingsPath = $derived(game.config.settingsPath);

	function getMessage(s: number) {
		if (s === 10) return 'Perfect!';
		if (s >= 8) return 'Almost there!';
		if (s >= 6) return 'Good effort!';
		return 'Keep practicing!';
	}
</script>

<HomeButton href="/" />

<div class="flex min-h-dvh flex-col items-center justify-center gap-8 p-6" in:fade={{ duration: 300 }}>

	<div class="text-center space-y-1">
		<div class="flex items-baseline justify-center gap-1">
			<span class="text-7xl font-bold tabular-nums">{score}</span>
			<span class="text-3xl text-muted-foreground font-medium">/ 10</span>
		</div>
		<p class="text-sm text-muted-foreground">{getMessage(score)}</p>
	</div>

	<div class="flex flex-col gap-3 w-full max-w-sm">
		<Button class="w-full" size="lg" onclick={() => {
			game.startGame(mode, settingsPath);
			goto(mode === 'harmony' ? '/harmony/play' : mode === 'scale_degree' ? '/scale_degree/play' : mode === 'interval_piano' ? '/interval_piano/play' : '/interval/play');
		}}>
			<RotateCcw class="size-4" />
			Try Again
		</Button>
		<Button variant="secondary" class="w-full" size="lg" onclick={() => goto(settingsPath)}>
			<Settings class="size-4" />
			Settings
		</Button>
		<Button variant="ghost" class="w-full" size="lg" onclick={() => { game.reset(); goto('/'); }}>
			<Home class="size-4" />
			Home
		</Button>
	</div>

</div>
