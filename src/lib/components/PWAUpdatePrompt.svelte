<script lang="ts">
	import { onMount } from 'svelte';

	let needRefresh = $state(false);
	let updateSW: ((reload?: boolean) => Promise<void>) | null = null;

	onMount(async () => {
		const { registerSW } = await import('virtual:pwa-register');
		updateSW = registerSW({
			onNeedRefresh() {
				needRefresh = true;
			}
		});
	});

	function update() {
		updateSW?.(true);
	}

	function dismiss() {
		needRefresh = false;
	}
</script>

{#if needRefresh}
	<div class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white shadow-lg">
		<span>New version available</span>
		<button
			onclick={update}
			class="rounded bg-white/20 px-3 py-1 font-medium hover:bg-white/30"
		>
			Update
		</button>
		<button
			onclick={dismiss}
			class="text-white/50 hover:text-white/80"
		>
			✕
		</button>
	</div>
{/if}
