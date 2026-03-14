import { Interval, ChordType, Note } from 'tonal';
import type { Interval as AppInterval, Chord } from './game.svelte.js';

function chordSemitones(tonalName: string): number[] {
	return ChordType.get(tonalName).intervals.map((i) => Interval.semitones(i) ?? 0);
}

export const BASE_MIDI = Note.midi('C4')!; // 60

export const ALL_INTERVALS: AppInterval[] = [
	{ semitones: Interval.semitones('2m')!, name: 'Minor 2nd',      shortName: 'm2' },
	{ semitones: Interval.semitones('2M')!, name: 'Major 2nd',      shortName: 'M2' },
	{ semitones: Interval.semitones('3m')!, name: 'Minor 3rd',      shortName: 'm3' },
	{ semitones: Interval.semitones('3M')!, name: 'Major 3rd',      shortName: 'M3' },
	{ semitones: Interval.semitones('4P')!, name: 'Perfect 4th',    shortName: 'P4' },
	{ semitones: Interval.semitones('4A')!, name: 'Tritone',        shortName: 'TT' },
	{ semitones: Interval.semitones('5P')!, name: 'Perfect 5th',    shortName: 'P5' },
	{ semitones: Interval.semitones('6m')!, name: 'Minor 6th',      shortName: 'm6' },
	{ semitones: Interval.semitones('6M')!, name: 'Major 6th',      shortName: 'M6' },
	{ semitones: Interval.semitones('7m')!, name: 'Minor 7th',      shortName: 'm7' },
	{ semitones: Interval.semitones('7M')!, name: 'Major 7th',      shortName: 'M7' },
	{ semitones: Interval.semitones('8P')!, name: 'Octave',         shortName: 'P8' },
];

export const ALL_TRIADS: Chord[] = [
	{ id: 'major',      semitones: chordSemitones('major'),      name: 'Major',      shortName: 'Maj' },
	{ id: 'minor',      semitones: chordSemitones('minor'),      name: 'Minor',      shortName: 'Min' },
	{ id: 'augmented',  semitones: chordSemitones('augmented'),  name: 'Augmented',  shortName: 'Aug' },
	{ id: 'diminished', semitones: chordSemitones('diminished'), name: 'Diminished', shortName: 'Dim' },
];

export const ALL_SEVENTH_CHORDS: Chord[] = [
	{ id: 'major7',    semitones: chordSemitones('major seventh'),    name: 'Major 7',    shortName: 'Maj7' },
	{ id: 'dominant7', semitones: chordSemitones('dominant seventh'), name: 'Dominant 7', shortName: 'Dom7' },
	{ id: 'minor7',    semitones: chordSemitones('minor seventh'),    name: 'Minor 7',    shortName: 'Min7' },
];

// Shell voicings: root + 3rd + 7th (no 5th) — not in tonal, kept manual
export const ALL_SHELL_SEVENTH_CHORDS: Chord[] = [
	{ id: 'shell_major7',    semitones: [0, 4, 11], name: 'Major 7 Shell',    shortName: 'Maj7s' },
	{ id: 'shell_dominant7', semitones: [0, 4, 10], name: 'Dominant 7 Shell', shortName: 'Dom7s' },
	{ id: 'shell_minor7',    semitones: [0, 3, 10], name: 'Minor 7 Shell',    shortName: 'Min7s' },
];
