import { game } from '$lib/game.svelte.js';
import { getStore } from './store.js';
import type { Attempt } from './types.js';

let sessionId = '';
let attemptsSaved = 0;

function getAvailableKeys(): string[] {
	const cfg = game.config;
	const keys: string[] = [];
	for (const i of cfg.intervals) keys.push(String(i.semitones));
	for (const c of cfg.triads) keys.push(c.id);
	for (const c of cfg.seventhChords) keys.push(c.id);
	for (const c of cfg.shellSeventhChords) keys.push(c.id);
	for (const d of cfg.scaleDegrees) keys.push(String(d.degree));
	return keys;
}

export function initTracker(): void {
	// Watch for game phase transitions and new answers
	$effect(() => {
		const phase = game.phase;
		const rounds = game.rounds;

		if (phase === 'playing' && sessionId === '') {
			// New session started
			sessionId = crypto.randomUUID();
			attemptsSaved = 0;
		}

		if (phase === 'playing') {
			// Check for new answered rounds
			const answeredRounds = rounds.filter((r) => r.answer !== null);
			const newCount = answeredRounds.length;

			if (newCount > attemptsSaved) {
				const s = getStore();
				const newAttempts: Attempt[] = [];
				const availableKeys = getAvailableKeys();

				for (let i = attemptsSaved; i < newCount; i++) {
					const r = answeredRounds[i];
					if (r.answer === null || r.correct === null) continue;

					const q = r.question;
					const questionKey =
						q.type === 'interval'
							? String(q.interval.semitones)
							: q.type === 'scale_degree'
							? String(q.scaleDegree.degree)
							: q.chord.id;
					const questionName =
						q.type === 'interval'
							? q.interval.name
							: q.type === 'scale_degree'
							? q.scaleDegree.name
							: q.chord.name;
					newAttempts.push({
						id: crypto.randomUUID(),
						sessionId,
						timestamp: Date.now(),
						mode: game.config.mode,
						questionType: q.type,
						questionKey,
						questionName,
						direction: r.direction,
						availableKeys,
						answerKey: r.answer,
						correct: r.correct,
						roundIndex: i,
					});
				}

				if (newAttempts.length > 0) {
					s.saveAttempts(newAttempts);
					attemptsSaved = newCount;
				}
			}
		}

		if (phase === 'results' && sessionId) {
			// Session completed
			getStore().saveSession({
				sessionId,
				timestamp: Date.now(),
				mode: game.config.mode,
				score: game.getScore(),
				totalRounds: rounds.length,
				completed: true,
			});
			sessionId = '';
		}

		if (phase === 'config' && sessionId) {
			// Session abandoned — save partial summary if any attempts were recorded
			if (attemptsSaved > 0) {
				const correctCount = rounds
					.filter((r) => r.answer !== null)
					.filter((r) => r.correct).length;
				getStore().saveSession({
					sessionId,
					timestamp: Date.now(),
					mode: game.config.mode,
					score: correctCount,
					totalRounds: attemptsSaved,
					completed: false,
				});
			}
			sessionId = '';
		}
	});
}
