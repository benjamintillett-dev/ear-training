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

export const ALL_INTERVALS: Interval[] = [
	{ semitones: 0, name: 'Perfect Unison', shortName: 'P1' },
	{ semitones: 1, name: 'Minor 2nd', shortName: 'm2' },
	{ semitones: 2, name: 'Major 2nd', shortName: 'M2' },
	{ semitones: 3, name: 'Minor 3rd', shortName: 'm3' },
	{ semitones: 4, name: 'Major 3rd', shortName: 'M3' },
	{ semitones: 5, name: 'Perfect 4th', shortName: 'P4' },
	{ semitones: 6, name: 'Tritone', shortName: 'TT' },
	{ semitones: 7, name: 'Perfect 5th', shortName: 'P5' },
	{ semitones: 8, name: 'Minor 6th', shortName: 'm6' },
	{ semitones: 9, name: 'Major 6th', shortName: 'M6' },
	{ semitones: 10, name: 'Minor 7th', shortName: 'm7' },
	{ semitones: 11, name: 'Major 7th', shortName: 'M7' },
	{ semitones: 12, name: 'Octave', shortName: 'P8' },
];

export const ALL_TRIADS: Chord[] = [
	{ id: 'major',      semitones: [0, 4, 7], name: 'Major',      shortName: 'Maj' },
	{ id: 'minor',      semitones: [0, 3, 7], name: 'Minor',      shortName: 'Min' },
	{ id: 'augmented',  semitones: [0, 4, 8], name: 'Augmented',  shortName: 'Aug' },
	{ id: 'diminished', semitones: [0, 3, 6], name: 'Diminished', shortName: 'Dim' },
];

export const ALL_SEVENTH_CHORDS: Chord[] = [
	{ id: 'major7',    semitones: [0, 4, 7, 11], name: 'Major 7',    shortName: 'Maj7' },
	{ id: 'dominant7', semitones: [0, 4, 7, 10], name: 'Dominant 7', shortName: 'Dom7' },
	{ id: 'minor7',    semitones: [0, 3, 7, 10], name: 'Minor 7',    shortName: 'Min7' },
];

// Shell voicings: root + 3rd + 7th (no 5th)
export const ALL_SHELL_SEVENTH_CHORDS: Chord[] = [
	{ id: 'shell_major7',    semitones: [0, 4, 11], name: 'Major 7 Shell',    shortName: 'Maj7s' },
	{ id: 'shell_dominant7', semitones: [0, 4, 10], name: 'Dominant 7 Shell', shortName: 'Dom7s' },
	{ id: 'shell_minor7',    semitones: [0, 3, 10], name: 'Minor 7 Shell',    shortName: 'Min7s' },
];

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
		intervals: ALL_INTERVALS.filter((i) => [0, 2, 4, 5, 7, 9, 11, 12].includes(i.semitones)),
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
