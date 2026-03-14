export type Direction = 'up' | 'down' | 'both' | 'harmonic';

export interface Interval {
	semitones: number;
	name: string;
	shortName: string;
}

export interface Chord {
	id: string;
	semitones: number[]; // offsets from root (C4 = 0)
	name: string;
	shortName: string;
}

import { ALL_INTERVALS, ALL_TRIADS, ALL_SEVENTH_CHORDS, ALL_SHELL_SEVENTH_CHORDS } from './theory.js';
export { ALL_INTERVALS, ALL_TRIADS, ALL_SEVENTH_CHORDS, ALL_SHELL_SEVENTH_CHORDS };

export type RoundQuestion =
	| { type: 'interval'; interval: Interval }
	| { type: 'chord'; chord: Chord };

export interface Round {
	question: RoundQuestion;
	direction: 'up' | 'down';
	answer: string | null; // interval: semitones.toString(), chord: chord.id
	correct: boolean | null;
}

export interface GameConfig {
	mode: 'interval' | 'interval_piano' | 'harmony';
	direction: Direction;
	intervals: Interval[];
	triads: Chord[];
	seventhChords: Chord[];
	shellSeventhChords: Chord[];
}

function createGameStore() {
	let config = $state<GameConfig>({
		mode: 'interval',
		direction: 'up',
		intervals: ALL_INTERVALS.filter((i) => [2, 4, 5, 7, 9, 11, 12].includes(i.semitones)),
		triads: [],
		seventhChords: [],
		shellSeventhChords: [],
	});

	let rounds = $state<Round[]>([]);
	let currentRound = $state(0);
	let phase = $state<'config' | 'playing' | 'results'>('config');

	function startGame(mode: 'interval' | 'interval_piano' | 'harmony') {
		config = { ...config, mode };
		const generated: Round[] = [];

		for (let i = 0; i < 10; i++) {
			let question: RoundQuestion;

			if (mode === 'harmony' && (config.triads.length > 0 || config.seventhChords.length > 0 || config.shellSeventhChords.length > 0)) {
				const pool = [
					...config.intervals.map((interval) => ({ type: 'interval' as const, interval })),
					...config.triads.map((chord) => ({ type: 'chord' as const, chord })),
					...config.seventhChords.map((chord) => ({ type: 'chord' as const, chord })),
					...config.shellSeventhChords.map((chord) => ({ type: 'chord' as const, chord })),
				];
				question = pool[Math.floor(Math.random() * pool.length)];
			} else {
				const interval = config.intervals[Math.floor(Math.random() * config.intervals.length)];
				question = { type: 'interval', interval };
			}

			let direction: 'up' | 'down';
			if (mode === 'harmony' || config.direction === 'both') {
				direction = Math.random() < 0.5 ? 'up' : 'down';
			} else {
				direction = config.direction as 'up' | 'down';
			}

			generated.push({ question, direction, answer: null, correct: null });
		}

		rounds = generated;
		currentRound = 0;
		phase = 'playing';
	}

	function submitAnswer(key: string) {
		const round = rounds[currentRound];
		round.answer = key;
		round.correct = round.question.type === 'interval'
			? key === String(round.question.interval.semitones)
			: key === round.question.chord.id;
		rounds = [...rounds];
	}

	function nextRound() {
		if (currentRound < 9) {
			currentRound++;
		} else {
			phase = 'results';
		}
	}

	function reset() {
		rounds = [];
		currentRound = 0;
		phase = 'config';
	}

	function getScore() {
		return rounds.filter((r) => r.correct).length;
	}

	function toggleInterval(semitones: number) {
		const interval = ALL_INTERVALS.find((i) => i.semitones === semitones)!;
		const exists = config.intervals.some((i) => i.semitones === semitones);
		config = {
			...config,
			intervals: exists
				? config.intervals.filter((i) => i.semitones !== semitones)
				: [...config.intervals, interval].sort((a, b) => a.semitones - b.semitones),
		};
	}

	function toggleTriad(id: string) {
		const chord = ALL_TRIADS.find((t) => t.id === id)!;
		const exists = config.triads.some((t) => t.id === id);
		config = {
			...config,
			triads: exists
				? config.triads.filter((t) => t.id !== id)
				: [...config.triads, chord],
		};
	}

	function toggleSeventhChord(id: string) {
		const chord = ALL_SEVENTH_CHORDS.find((c) => c.id === id)!;
		const exists = config.seventhChords.some((c) => c.id === id);
		config = {
			...config,
			seventhChords: exists
				? config.seventhChords.filter((c) => c.id !== id)
				: [...config.seventhChords, chord],
		};
	}

	function toggleShellSeventhChord(id: string) {
		const chord = ALL_SHELL_SEVENTH_CHORDS.find((c) => c.id === id)!;
		const exists = config.shellSeventhChords.some((c) => c.id === id);
		config = {
			...config,
			shellSeventhChords: exists
				? config.shellSeventhChords.filter((c) => c.id !== id)
				: [...config.shellSeventhChords, chord],
		};
	}

	return {
		get config() { return config; },
		get rounds() { return rounds; },
		get currentRound() { return currentRound; },
		get phase() { return phase; },
		startGame,
		submitAnswer,
		nextRound,
		reset,
		getScore,
		setConfig(c: Partial<GameConfig>) {
			config = { ...config, ...c };
		},
		toggleInterval,
		toggleTriad,
		toggleSeventhChord,
		toggleShellSeventhChord,
	};
}

export const game = createGameStore();
