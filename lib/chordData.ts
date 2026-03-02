export interface GuitarChordPosition {
  frets: number[]; // -1 = muted, 0 = open, 1-19 = fret
  fingers: number[]; // 0 = no finger, 1-4 = finger number
  barres?: { fret: number; fromString: number; toString: number }[];
  baseFret?: number;
}

export interface PianoChordNotes {
  notes: string[]; // e.g., ['C4', 'E4', 'G4']
}

export interface UkuleleChordPosition {
  frets: number[]; // 4 strings: G C E A
  fingers: number[];
  barres?: { fret: number; fromString: number; toString: number }[];
}

export interface ChordInfo {
  name: string;
  displayName: string;
  notes: string[];
  guitar?: GuitarChordPosition;
  piano?: PianoChordNotes;
  ukulele?: UkuleleChordPosition;
  description?: string;
}

export const CHORD_LIBRARY: ChordInfo[] = [
  // --- C chords ---
  {
    name: 'C', displayName: 'C Major',
    notes: ['C', 'E', 'G'],
    guitar: { frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0] },
    piano: { notes: ['C4', 'E4', 'G4'] },
    ukulele: { frets: [0, 0, 0, 3], fingers: [0, 0, 0, 3] },
  },
  {
    name: 'Cm', displayName: 'C Minor',
    notes: ['C', 'Eb', 'G'],
    guitar: { frets: [-1, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 3, fromString: 5, toString: 0 }], baseFret: 3 },
    piano: { notes: ['C4', 'D#4', 'G4'] },
    ukulele: { frets: [0, 3, 3, 3], fingers: [0, 1, 2, 3] },
  },
  {
    name: 'C7', displayName: 'C Dominant 7th',
    notes: ['C', 'E', 'G', 'Bb'],
    guitar: { frets: [-1, 3, 2, 3, 1, 0], fingers: [0, 3, 2, 4, 1, 0] },
    piano: { notes: ['C4', 'E4', 'G4', 'A#4'] },
    ukulele: { frets: [0, 0, 0, 1], fingers: [0, 0, 0, 1] },
  },
  {
    name: 'Cmaj7', displayName: 'C Major 7th',
    notes: ['C', 'E', 'G', 'B'],
    guitar: { frets: [-1, 3, 2, 0, 0, 0], fingers: [0, 3, 2, 0, 0, 0] },
    piano: { notes: ['C4', 'E4', 'G4', 'B4'] },
    ukulele: { frets: [0, 2, 0, 2], fingers: [0, 1, 0, 2] },
  },
  // --- D chords ---
  {
    name: 'D', displayName: 'D Major',
    notes: ['D', 'F#', 'A'],
    guitar: { frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
    piano: { notes: ['D4', 'F#4', 'A4'] },
    ukulele: { frets: [2, 2, 2, 0], fingers: [1, 2, 3, 0] },
  },
  {
    name: 'Dm', displayName: 'D Minor',
    notes: ['D', 'F', 'A'],
    guitar: { frets: [-1, -1, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
    piano: { notes: ['D4', 'F4', 'A4'] },
    ukulele: { frets: [2, 2, 1, 0], fingers: [2, 3, 1, 0] },
  },
  {
    name: 'D7', displayName: 'D Dominant 7th',
    notes: ['D', 'F#', 'A', 'C'],
    guitar: { frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3] },
    piano: { notes: ['D4', 'F#4', 'A4', 'C5'] },
    ukulele: { frets: [2, 0, 2, 0], fingers: [2, 0, 3, 0] },
  },
  // --- E chords ---
  {
    name: 'E', displayName: 'E Major',
    notes: ['E', 'G#', 'B'],
    guitar: { frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0] },
    piano: { notes: ['E4', 'G#4', 'B4'] },
    ukulele: { frets: [4, 4, 4, 2], fingers: [2, 3, 4, 1], barres: [{ fret: 4, fromString: 3, toString: 1 }] },
  },
  {
    name: 'Em', displayName: 'E Minor',
    notes: ['E', 'G', 'B'],
    guitar: { frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0] },
    piano: { notes: ['E4', 'G4', 'B4'] },
    ukulele: { frets: [0, 4, 3, 2], fingers: [0, 4, 3, 2] },
  },
  {
    name: 'E7', displayName: 'E Dominant 7th',
    notes: ['E', 'G#', 'B', 'D'],
    guitar: { frets: [0, 2, 0, 1, 0, 0], fingers: [0, 2, 0, 1, 0, 0] },
    piano: { notes: ['E4', 'G#4', 'B4', 'D5'] },
    ukulele: { frets: [1, 2, 0, 2], fingers: [1, 2, 0, 3] },
  },
  // --- F chords ---
  {
    name: 'F', displayName: 'F Major',
    notes: ['F', 'A', 'C'],
    guitar: { frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 0 }] },
    piano: { notes: ['F4', 'A4', 'C5'] },
    ukulele: { frets: [2, 0, 1, 0], fingers: [2, 0, 1, 0] },
  },
  {
    name: 'Fm', displayName: 'F Minor',
    notes: ['F', 'Ab', 'C'],
    guitar: { frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 3, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 0 }] },
    piano: { notes: ['F4', 'G#4', 'C5'] },
    ukulele: { frets: [1, 0, 1, 3], fingers: [1, 0, 2, 4] },
  },
  {
    name: 'F7', displayName: 'F Dominant 7th',
    notes: ['F', 'A', 'C', 'Eb'],
    guitar: { frets: [1, 1, 2, 1, 3, 1], fingers: [1, 1, 3, 2, 4, 1], barres: [{ fret: 1, fromString: 5, toString: 0 }] },
    piano: { notes: ['F4', 'A4', 'C5', 'D#5'] },
    ukulele: { frets: [2, 3, 1, 3], fingers: [2, 3, 1, 4] },
  },
  // --- G chords ---
  {
    name: 'G', displayName: 'G Major',
    notes: ['G', 'B', 'D'],
    guitar: { frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3] },
    piano: { notes: ['G4', 'B4', 'D5'] },
    ukulele: { frets: [0, 2, 3, 2], fingers: [0, 1, 3, 2] },
  },
  {
    name: 'Gm', displayName: 'G Minor',
    notes: ['G', 'Bb', 'D'],
    guitar: { frets: [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1], barres: [{ fret: 3, fromString: 5, toString: 0 }] },
    piano: { notes: ['G4', 'A#4', 'D5'] },
    ukulele: { frets: [0, 2, 3, 1], fingers: [0, 2, 3, 1] },
  },
  {
    name: 'G7', displayName: 'G Dominant 7th',
    notes: ['G', 'B', 'D', 'F'],
    guitar: { frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1] },
    piano: { notes: ['G4', 'B4', 'D5', 'F5'] },
    ukulele: { frets: [0, 2, 1, 2], fingers: [0, 2, 1, 3] },
  },
  // --- A chords ---
  {
    name: 'A', displayName: 'A Major',
    notes: ['A', 'C#', 'E'],
    guitar: { frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
    piano: { notes: ['A4', 'C#5', 'E5'] },
    ukulele: { frets: [2, 1, 0, 0], fingers: [2, 1, 0, 0] },
  },
  {
    name: 'Am', displayName: 'A Minor',
    notes: ['A', 'C', 'E'],
    guitar: { frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
    piano: { notes: ['A4', 'C5', 'E5'] },
    ukulele: { frets: [2, 0, 0, 0], fingers: [1, 0, 0, 0] },
  },
  {
    name: 'A7', displayName: 'A Dominant 7th',
    notes: ['A', 'C#', 'E', 'G'],
    guitar: { frets: [-1, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
    piano: { notes: ['A4', 'C#5', 'E5', 'G5'] },
    ukulele: { frets: [0, 1, 0, 0], fingers: [0, 1, 0, 0] },
  },
  {
    name: 'Am7', displayName: 'A Minor 7th',
    notes: ['A', 'C', 'E', 'G'],
    guitar: { frets: [-1, 0, 2, 0, 1, 0], fingers: [0, 0, 2, 0, 1, 0] },
    piano: { notes: ['A4', 'C5', 'E5', 'G5'] },
    ukulele: { frets: [0, 0, 0, 0], fingers: [0, 0, 0, 0] },
  },
  // --- B chords ---
  {
    name: 'B', displayName: 'B Major',
    notes: ['B', 'D#', 'F#'],
    guitar: { frets: [-1, 2, 4, 4, 4, 2], fingers: [0, 1, 2, 3, 4, 1], barres: [{ fret: 2, fromString: 4, toString: 0 }] },
    piano: { notes: ['B4', 'D#5', 'F#5'] },
    ukulele: { frets: [4, 3, 2, 2], fingers: [4, 3, 1, 2] },
  },
  {
    name: 'Bm', displayName: 'B Minor',
    notes: ['B', 'D', 'F#'],
    guitar: { frets: [-1, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1], barres: [{ fret: 2, fromString: 4, toString: 0 }] },
    piano: { notes: ['B4', 'D5', 'F#5'] },
    ukulele: { frets: [4, 2, 2, 2], fingers: [4, 1, 2, 3] },
  },
  {
    name: 'B7', displayName: 'B Dominant 7th',
    notes: ['B', 'D#', 'F#', 'A'],
    guitar: { frets: [-1, 2, 1, 2, 0, 2], fingers: [0, 2, 1, 3, 0, 4] },
    piano: { notes: ['B4', 'D#5', 'F#5', 'A5'] },
    ukulele: { frets: [2, 3, 2, 2], fingers: [1, 3, 2, 4] },
  },
  // Additional
  {
    name: 'Fmaj7', displayName: 'F Major 7th',
    notes: ['F', 'A', 'C', 'E'],
    guitar: { frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0] },
    piano: { notes: ['F4', 'A4', 'C5', 'E5'] },
    ukulele: { frets: [2, 4, 1, 3], fingers: [2, 4, 1, 3] },
  },
  {
    name: 'Gmaj7', displayName: 'G Major 7th',
    notes: ['G', 'B', 'D', 'F#'],
    guitar: { frets: [3, 2, 0, 0, 0, 2], fingers: [3, 2, 0, 0, 0, 1] },
    piano: { notes: ['G4', 'B4', 'D5', 'F#5'] },
    ukulele: { frets: [0, 2, 2, 2], fingers: [0, 1, 2, 3] },
  },
  {
    name: 'Amaj7', displayName: 'A Major 7th',
    notes: ['A', 'C#', 'E', 'G#'],
    guitar: { frets: [-1, 0, 2, 1, 2, 0], fingers: [0, 0, 3, 1, 4, 0] },
    piano: { notes: ['A4', 'C#5', 'E5', 'G#5'] },
    ukulele: { frets: [1, 1, 0, 0], fingers: [1, 2, 0, 0] },
  },
  {
    name: 'Dm7', displayName: 'D Minor 7th',
    notes: ['D', 'F', 'A', 'C'],
    guitar: { frets: [-1, -1, 0, 2, 1, 1], fingers: [0, 0, 0, 3, 1, 2] },
    piano: { notes: ['D4', 'F4', 'A4', 'C5'] },
    ukulele: { frets: [2, 2, 1, 3], fingers: [2, 3, 1, 4] },
  },
  {
    name: 'Em7', displayName: 'E Minor 7th',
    notes: ['E', 'G', 'B', 'D'],
    guitar: { frets: [0, 2, 2, 0, 3, 0], fingers: [0, 2, 3, 0, 4, 0] },
    piano: { notes: ['E4', 'G4', 'B4', 'D5'] },
    ukulele: { frets: [0, 2, 0, 2], fingers: [0, 2, 0, 3] },
  },
  {
    name: 'Csus2', displayName: 'C Suspended 2nd',
    notes: ['C', 'D', 'G'],
    guitar: { frets: [-1, 3, 0, 0, 1, 3], fingers: [0, 3, 0, 0, 1, 4] },
    piano: { notes: ['C4', 'D4', 'G4'] },
    ukulele: { frets: [0, 2, 3, 3], fingers: [0, 1, 3, 4] },
  },
  {
    name: 'Gsus4', displayName: 'G Suspended 4th',
    notes: ['G', 'C', 'D'],
    guitar: { frets: [3, 3, 0, 0, 1, 3], fingers: [2, 3, 0, 0, 1, 4] },
    piano: { notes: ['G4', 'C5', 'D5'] },
    ukulele: { frets: [0, 2, 3, 3], fingers: [0, 1, 3, 4] },
  },
];

export function findChord(name: string): ChordInfo | undefined {
  return CHORD_LIBRARY.find(c => c.name === name);
}

export const CHORD_CATEGORIES = [
  { label: 'Major', chords: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
  { label: 'Minor', chords: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'] },
  { label: 'Dominant 7th', chords: ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7'] },
  { label: 'Major 7th', chords: ['Cmaj7', 'Fmaj7', 'Gmaj7', 'Amaj7'] },
  { label: 'Minor 7th', chords: ['Am7', 'Dm7', 'Em7'] },
  { label: 'Suspended', chords: ['Csus2', 'Gsus4'] },
];
