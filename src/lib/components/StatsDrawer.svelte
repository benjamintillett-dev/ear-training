<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import {
		BarChart3,
		ChevronsUp,
		ChevronUp,
		Equal,
		ChevronDown,
		ChevronsDown,
	} from 'lucide-svelte';
	import { getStore } from '$lib/analytics/store.js';
	import {
		computeQuestionStats,
		computeRecentAccuracy,
		type QuestionStats,
	} from '$lib/analytics/queries.js';

	interface StatsItem {
		key: string;
		name: string;
		shortName: string;
	}

	let {
		items,
		modes,
	}: {
		items: StatsItem[];
		modes?: string[];
	} = $props();

	let open = $state(false);
	let statsMap = $state<Map<string, QuestionStats>>(new Map());
	let trendMap = $state<Map<string, { delta: number }>>(new Map());

	function loadStats() {
		const store = getStore();
		let attempts = store.getAttempts();
		if (modes?.length) {
			attempts = attempts.filter((a) => modes!.includes(a.mode));
		}
		const stats = computeQuestionStats(attempts);
		statsMap = new Map(stats.map((s) => [s.questionKey, s]));

		const newTrendMap = new Map<string, { delta: number }>();
		for (const item of items) {
			let questionAttempts = store.getAttemptsByQuestion(item.key);
			if (modes?.length) {
				questionAttempts = questionAttempts.filter((a) => modes!.includes(a.mode));
			}
			const trend = computeRecentAccuracy(questionAttempts);
			if (trend) {
				newTrendMap.set(item.key, { delta: trend.delta });
			}
		}
		trendMap = newTrendMap;
	}

	function handleOpenChange(isOpen: boolean) {
		open = isOpen;
		if (isOpen) loadStats();
	}

	function accuracyColor(accuracy: number): string {
		if (accuracy < 0.5) return 'text-red-500';
		if (accuracy < 0.8) return 'text-yellow-500';
		return 'text-green-500';
	}

	function trendInfo(delta: number): {
		icon: typeof ChevronsUp;
		colorClass: string;
		label: string;
	} {
		const pct = delta * 100;
		if (pct >= 20) return { icon: ChevronsUp, colorClass: 'text-green-500', label: 'surging' };
		if (pct >= 5) return { icon: ChevronUp, colorClass: 'text-lime-500', label: 'improving' };
		if (pct > -5) return { icon: Equal, colorClass: 'text-yellow-500', label: 'steady' };
		if (pct > -20)
			return { icon: ChevronDown, colorClass: 'text-orange-500', label: 'declining' };
		return { icon: ChevronsDown, colorClass: 'text-red-500', label: 'struggling' };
	}
</script>

<Drawer.Root open={open} onOpenChange={handleOpenChange}>
	<Drawer.Trigger
		class="fixed bottom-4 left-4 z-40 flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-md hover:bg-accent transition-colors"
		aria-label="View accuracy stats"
	>
		<BarChart3 class="size-5" />
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Accuracy Stats</Drawer.Title>
			<Drawer.Description>Your accuracy per question item</Drawer.Description>
		</Drawer.Header>
		<div class="px-4 pb-8 flex flex-col gap-1.5 max-h-[60vh] overflow-y-auto">
			{#each items as item}
				{@const stat = statsMap.get(item.key)}
				{@const hasData = stat && stat.total > 0}
				{@const trend = trendMap.get(item.key)}
				<div class="flex flex-col gap-1 rounded-lg border border-border px-3 py-2.5">
					<div class="flex items-center gap-3">
						<span
							class="inline-flex min-w-[3rem] items-center justify-center rounded-md bg-muted px-2 py-1 text-xs font-bold"
						>
							{item.shortName}
						</span>
						<span class="flex-1 text-sm">{item.name}</span>
						{#if hasData}
							<span class="text-sm font-semibold tabular-nums {accuracyColor(stat.accuracy)}">
								{Math.round(stat.accuracy * 100)}%
							</span>
						{:else}
							<span class="text-sm text-muted-foreground">&mdash;</span>
						{/if}
					</div>
					{#if hasData}
						<div class="flex items-center gap-1 pl-[calc(3rem+0.75rem)] text-xs text-muted-foreground">
							<span>{stat.total} played</span>
							{#if trend}
								{@const info = trendInfo(trend.delta)}
								<span class="mx-1">·</span>
								<info.icon class="size-3.5 {info.colorClass}" />
								<span class={info.colorClass}>{info.label}</span>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</Drawer.Content>
</Drawer.Root>
