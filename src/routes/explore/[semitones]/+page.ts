import { ALL_INTERVALS } from '$lib/game.svelte.js';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const semitones = parseInt(params.semitones);
	const interval = ALL_INTERVALS.find((i) => i.semitones === semitones);
	if (!interval) error(404, 'Interval not found');
	return { interval };
};
