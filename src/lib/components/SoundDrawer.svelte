<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { SOUND_PRESETS, setPreset, getActivePresetId } from '$lib/audio.js';
	import { Music2 } from 'lucide-svelte';

	let activeId = $state(getActivePresetId());
	let open = $state(false);

	function select(id: string) {
		setPreset(id);
		activeId = id;
		open = false;
	}

	const activePreset = $derived(SOUND_PRESETS.find((p) => p.id === activeId)!);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		class="fixed bottom-4 right-4 z-40 flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-accent transition-colors"
		aria-label="Choose sound"
	>
		<Music2 class="size-5" />
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Sound</Drawer.Title>
			<Drawer.Description>Choose an instrument for your session</Drawer.Description>
		</Drawer.Header>
		<div class="px-4 pb-8 flex flex-col gap-2">
			{#each SOUND_PRESETS as preset}
				<button
					onclick={() => select(preset.id)}
					class="flex items-center gap-3 rounded-lg border p-3 text-left transition-colors
						{preset.id === activeId
							? 'border-primary bg-primary/5'
							: 'border-border hover:bg-accent'}"
				>
					<div
						class="size-2.5 rounded-full flex-shrink-0
							{preset.id === activeId ? 'bg-primary' : 'bg-border'}"
					></div>
					<div>
						<div class="text-sm font-medium">{preset.name}</div>
						<div class="text-xs text-muted-foreground">{preset.description}</div>
					</div>
				</button>
			{/each}
		</div>
	</Drawer.Content>
</Drawer.Root>
