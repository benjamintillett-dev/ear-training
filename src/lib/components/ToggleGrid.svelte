<script lang="ts">
	let { label, items, onAll, onNone }: {
		label: string;
		items: Array<{ shortName: string; selected: boolean; onToggle: () => void }>;
		onAll: () => void;
		onNone: () => void;
	} = $props();
</script>

<div class="flex flex-col gap-2">
	<div class="flex justify-between items-center px-1">
		<span class="text-xs text-muted-foreground">{label}</span>
		<div class="flex gap-3">
			<button
				onclick={onAll}
				class="text-xs text-muted-foreground hover:text-foreground transition-colors"
			>All</button>
			<button
				onclick={onNone}
				class="text-xs text-muted-foreground hover:text-foreground transition-colors"
			>None</button>
		</div>
	</div>
	<div class="grid grid-cols-4 gap-3">
		{#each items as item}
			<button
				onclick={item.onToggle}
				class="aspect-square rounded-2xl border-2 font-bold text-sm transition-all duration-150 cursor-pointer
					{item.selected
						? 'border-primary bg-primary text-primary-foreground'
						: 'border-border bg-background text-foreground hover:bg-accent'}"
			>
				{item.shortName}
			</button>
		{/each}
	</div>
</div>
