// Piano sampler using tonejs-instruments samples
// https://github.com/nbrosowsky/tonejs-instruments
// Middle C = C4

const BASE_URL = 'https://nbrosowsky.github.io/tonejs-instruments/samples/piano/';

// Sampler needs a subset of notes; Tone.js interpolates between them.
// Covering C2–C6 gives us plenty of range for intervals around C4.
const SAMPLE_MAP: Record<string, string> = {
	'C2': 'C2.mp3', 'Db2': 'Cs2.mp3', 'D2': 'D2.mp3', 'Eb2': 'Ds2.mp3',
	'E2': 'E2.mp3', 'F2': 'F2.mp3', 'Gb2': 'Fs2.mp3', 'G2': 'G2.mp3',
	'Ab2': 'Gs2.mp3', 'A2': 'A2.mp3', 'Bb2': 'As2.mp3', 'B2': 'B2.mp3',
	'C3': 'C3.mp3', 'Db3': 'Cs3.mp3', 'D3': 'D3.mp3', 'Eb3': 'Ds3.mp3',
	'E3': 'E3.mp3', 'F3': 'F3.mp3', 'Gb3': 'Fs3.mp3', 'G3': 'G3.mp3',
	'Ab3': 'Gs3.mp3', 'A3': 'A3.mp3', 'Bb3': 'As3.mp3', 'B3': 'B3.mp3',
	'C4': 'C4.mp3', 'Db4': 'Cs4.mp3', 'D4': 'D4.mp3', 'Eb4': 'Ds4.mp3',
	'E4': 'E4.mp3', 'F4': 'F4.mp3', 'Gb4': 'Fs4.mp3', 'G4': 'G4.mp3',
	'Ab4': 'Gs4.mp3', 'A4': 'A4.mp3', 'Bb4': 'As4.mp3', 'B4': 'B4.mp3',
	'C5': 'C5.mp3', 'Db5': 'Cs5.mp3', 'D5': 'D5.mp3', 'Eb5': 'Ds5.mp3',
	'E5': 'E5.mp3', 'F5': 'F5.mp3', 'Gb5': 'Fs5.mp3', 'G5': 'G5.mp3',
	'Ab5': 'Gs5.mp3', 'A5': 'A5.mp3', 'Bb5': 'As5.mp3', 'B5': 'B5.mp3',
	'C6': 'C6.mp3',
};

let sampler: import('tone').Sampler | null = null;
let samplerReady = false;
let samplerLoading: Promise<void> | null = null;

async function getSampler(): Promise<import('tone').Sampler> {
	if (sampler && samplerReady) return sampler;

	if (samplerLoading) {
		await samplerLoading;
		return sampler!;
	}

	samplerLoading = new Promise(async (resolve) => {
		const Tone = await import('tone');
		await Tone.start();
		sampler = new Tone.Sampler(SAMPLE_MAP, {
			baseUrl: BASE_URL,
			onload: () => {
				samplerReady = true;
				resolve();
			},
		}).toDestination();
	});

	await samplerLoading;
	return sampler!;
}

// Tone.js note names for semitone offsets from C4
const NOTE_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

function midiToNoteName(semitoneOffsetFromC4: number): string {
	const midi = 60 + semitoneOffsetFromC4;
	const octave = Math.floor(midi / 12) - 1;
	const name = NOTE_NAMES[midi % 12];
	return `${name}${octave}`;
}

// Play an arbitrary melody sequence.
// notes: array of [semitoneOffsetFromC4, durationInBeats]
// bpm: tempo (beats per minute)
// Each note sustains for 90% of its beat slot so adjacent notes are distinct.
export async function playNoteSequence(
	notes: Array<[semitone: number, beats: number]>,
	{ bpm = 100 }: { bpm?: number } = {}
): Promise<void> {
	const Tone = await import('tone');
	const s = await getSampler();
	const beatLen = 60 / bpm;
	const now = Tone.now();
	let t = 0;
	for (const [semitone, beats] of notes) {
		s.triggerAttackRelease(midiToNoteName(semitone), beats * beatLen * 0.9, now + t);
		t += beats * beatLen;
	}
	return new Promise((r) => setTimeout(r, (t + 0.2) * 1000));
}

export async function playInterval(semitones: number, direction: 'up' | 'down') {
	const Tone = await import('tone');
	const s = await getSampler();

	const middleC = midiToNoteName(0); // C4
	const otherNote = midiToNoteName(semitones); // always above middle C

	// Ascending: middle C → interval note
	// Descending: interval note → middle C
	const [first, second] = direction === 'up'
		? [middleC, otherNote]
		: [otherNote, middleC];

	const now = Tone.now();
	s.triggerAttackRelease(first, '2n', now);
	s.triggerAttackRelease(second, '2n', now + 0.75);
}

export function stopAll() {
	if (sampler && samplerReady) sampler.releaseAll();
}

export { getSampler as preloadSampler };
