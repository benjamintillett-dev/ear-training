export type Direction = 'up' | 'down' | 'both';

export interface Interval {
	semitones: number;
	name: string;
	shortName: string;
}

export const ALL_INTERVALS: Interval[] = [
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

export interface Round {
	interval: Interval;
	direction: 'up' | 'down';
	answer: number | null; // semitones of the chosen answer
	correct: boolean | null;
}

export interface GameConfig {
	direction: Direction;
	intervals: Interval[];
}

export interface GameState {
	config: GameConfig;
	rounds: Round[];
	currentRound: number;
	phase: 'config' | 'playing' | 'results';
}

function createGameStore() {
	let config = $state<GameConfig>({
		direction: 'up',
		intervals: ALL_INTERVALS.slice(0, 4),
	});

	let rounds = $state<Round[]>([]);
	let currentRound = $state(0);
	let phase = $state<'config' | 'playing' | 'results'>('config');

	function startGame() {
		const generated: Round[] = [];
		for (let i = 0; i < 10; i++) {
			const interval = config.intervals[Math.floor(Math.random() * config.intervals.length)];
			let direction: 'up' | 'down';
			if (config.direction === 'both') {
				direction = Math.random() < 0.5 ? 'up' : 'down';
			} else {
				direction = config.direction;
			}
			generated.push({ interval, direction, answer: null, correct: null });
		}
		rounds = generated;
		currentRound = 0;
		phase = 'playing';
	}

	function submitAnswer(semitones: number) {
		const round = rounds[currentRound];
		round.answer = semitones;
		round.correct = semitones === round.interval.semitones;
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
	};
}

export const game = createGameStore();
