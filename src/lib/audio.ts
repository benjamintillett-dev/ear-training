import { SplendidGrandPiano, Soundfont } from 'smplr';

// MIDI note number for a semitone offset from C4 (MIDI 60)
function midiNote(semitoneOffsetFromC4: number): number {
	return 60 + semitoneOffsetFromC4;
}

export interface SoundPreset {
	id: string;
	name: string;
	description: string;
}

export const SOUND_PRESETS: SoundPreset[] = [
	{ id: 'grand-piano',    name: 'Grand Piano',    description: 'Acoustic grand piano — natural sustain' },
	{ id: 'electric-piano', name: 'Electric Piano', description: 'Rhodes-style electric piano' },
	{ id: 'vibraphone',     name: 'Vibraphone',     description: 'Clear bell tone, very dry' },
	{ id: 'marimba',        name: 'Marimba',        description: 'Warm wooden bars, short decay' },
	{ id: 'music-box',      name: 'Music Box',      description: 'Delicate metallic plucks' },
	{ id: 'xylophone',      name: 'Xylophone',      description: 'Bright, dry wooden attack' },
	{ id: 'guitar',         name: 'Guitar',         description: 'Nylon string acoustic guitar' },
];

const SOUNDFONT_MAP: Record<string, string> = {
	'electric-piano': 'electric_piano_1',
	'vibraphone':     'vibraphone',
	'marimba':        'marimba',
	'music-box':      'music_box',
	'xylophone':      'xylophone',
	'guitar':         'acoustic_guitar_nylon',
};

type Instrument = { start(o: { note: number; time: number; duration?: number }): void; stop(): void };

let audioContext:      AudioContext           | null = null;
let compressor:        DynamicsCompressorNode | null = null;
let activePresetId                                   = 'grand-piano';
let instrument:        Instrument             | null = null;
let instrumentLoading: Promise<void>          | null = null;

export function getActivePresetId() { return activePresetId; }

export function setPreset(id: string) {
	if (id === activePresetId) return;
	instrument?.stop();
	instrument = null;
	instrumentLoading = null;
	activePresetId = id;
}

function ensureContext() {
	if (!audioContext) {
		audioContext = new AudioContext();
		compressor = new DynamicsCompressorNode(audioContext, {
			threshold: -12,
			ratio: 3,
			attack: 0.01,
			release: 0.25,
			knee: 10,
		});
		compressor.connect(audioContext.destination);
	}
	return { ctx: audioContext, comp: compressor! };
}

async function getInstrument(): Promise<{ inst: Instrument; ctx: AudioContext }> {
	const { ctx, comp } = ensureContext();
	if (ctx.state === 'suspended') await ctx.resume();

	if (instrument) return { inst: instrument, ctx };

	if (instrumentLoading) {
		await instrumentLoading;
		return { inst: instrument!, ctx };
	}

	instrumentLoading = (async () => {
		if (activePresetId === 'grand-piano') {
			const p = new SplendidGrandPiano(ctx, { destination: comp });
			await p.load;
			instrument = p as unknown as Instrument;
		} else {
			const sf = new Soundfont(ctx, { instrument: SOUNDFONT_MAP[activePresetId], destination: comp });
			await sf.load;
			instrument = sf as unknown as Instrument;
		}
	})();

	await instrumentLoading;
	return { inst: instrument!, ctx };
}

// 10ms stagger between simultaneous notes prevents stacked attack transients
// while remaining perceptually instantaneous.
const HARMONIC_STAGGER = 0.01;

export async function playNoteSequence(
	notes: Array<[semitone: number, beats: number]>,
	{ bpm = 100 }: { bpm?: number } = {}
): Promise<void> {
	const { inst, ctx } = await getInstrument();
	const beatLen = 60 / bpm;
	const now = ctx.currentTime;
	let t = 0;
	for (const [semitone, beats] of notes) {
		inst.start({ note: midiNote(semitone), time: now + t, duration: beats * beatLen * 0.9 });
		t += beats * beatLen;
	}
	return new Promise((r) => setTimeout(r, (t + 0.2) * 1000));
}

export async function playInterval(semitones: number, direction: 'up' | 'down') {
	const { inst, ctx } = await getInstrument();
	const [first, second] = direction === 'up' ? [0, semitones] : [semitones, 0];
	const now = ctx.currentTime;
	inst.start({ note: midiNote(first), duration: 2, time: now });
	inst.start({ note: midiNote(second), duration: 2, time: now + 0.75 });
}

export async function playIntervalHarmonic(semitones: number) {
	const { inst, ctx } = await getInstrument();
	const now = ctx.currentTime;
	inst.start({ note: midiNote(0), duration: 3, time: now });
	inst.start({ note: midiNote(semitones), duration: 3, time: now + HARMONIC_STAGGER });
}

export async function playTriad(semitones: number[]) {
	const { inst, ctx } = await getInstrument();
	const now = ctx.currentTime;
	semitones.forEach((offset, i) => {
		inst.start({ note: midiNote(offset), duration: 3, time: now + i * HARMONIC_STAGGER });
	});
}

export function stopAll() {
	instrument?.stop();
}

export async function preloadSampler() {
	await getInstrument();
}
