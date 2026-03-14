<script lang="ts">
	import { stopAll } from '$lib/audio.js';

	function goBack() {
		stopAll();
		history.back();
	}
</script>

<button
	onclick={goBack}
	class="fixed top-4 left-4 h-8 px-3 rounded-full border border-border bg-background shadow-sm
		flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors z-10"
>
	Settings
</button>
