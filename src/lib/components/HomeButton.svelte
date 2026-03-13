<script lang="ts">
	import { goto } from '$app/navigation';
	import { game } from '$lib/game.svelte.js';
	import { stopAll } from '$lib/audio.js';
	import { House } from 'lucide-svelte';

	function goHome() {
		stopAll();
		game.reset();
		goto('/');
	}
</script>

<button
	onclick={goHome}
	class="fixed top-4 right-4 size-10 rounded-full border border-border bg-background shadow-sm
		flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
	aria-label="Home"
>
	<House class="size-4" />
</button>
