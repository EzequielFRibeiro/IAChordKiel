// Chord template matching using chromagram analysis

const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Chord templates (12-bin chroma vectors, semitone intervals)
const CHORD_TEMPLATES: Record<string, number[]> = {
  // Major
  'C':  [1,0,0,0,1,0,0,1,0,0,0,0],
  'C#': [0,1,0,0,0,1,0,0,1,0,0,0],
  'D':  [0,0,1,0,0,0,1,0,0,1,0,0],
  'D#': [0,0,0,1,0,0,0,1,0,0,1,0],
  'E':  [0,0,0,0,1,0,0,0,1,0,0,1],
  'F':  [1,0,0,0,0,1,0,0,0,1,0,0],
  'F#': [0,1,0,0,0,0,1,0,0,0,1,0],
  'G':  [0,0,1,0,0,0,0,1,0,0,0,1],
  'G#': [1,0,0,1,0,0,0,0,1,0,0,0],
  'A':  [0,1,0,0,1,0,0,0,0,1,0,0],
  'A#': [0,0,1,0,0,1,0,0,0,0,1,0],
  'B':  [0,0,0,1,0,0,1,0,0,0,0,1],
  // Minor
  'Cm':  [1,0,0,1,0,0,0,1,0,0,0,0],
  'C#m': [0,1,0,0,1,0,0,0,1,0,0,0],
  'Dm':  [0,0,1,0,0,1,0,0,0,1,0,0],
  'D#m': [0,0,0,1,0,0,1,0,0,0,1,0],
  'Em':  [0,0,0,0,1,0,0,1,0,0,0,1],
  'Fm':  [1,0,0,0,0,1,0,0,1,0,0,0],
  'F#m': [0,1,0,0,0,0,1,0,0,1,0,0],
  'Gm':  [0,0,1,0,0,0,0,1,0,0,1,0],
  'G#m': [1,0,0,1,0,0,0,0,1,0,0,0],
  'Am':  [1,0,0,0,1,0,0,0,0,1,0,0],
  'A#m': [0,1,0,0,0,1,0,0,0,0,1,0],
  'Bm':  [0,0,1,0,0,0,1,0,0,0,0,1],
  // Dominant 7th
  'C7':  [1,0,0,0,1,0,0,1,0,0,1,0],
  'D7':  [0,0,1,0,0,0,1,0,0,1,0,1],
  'E7':  [0,0,0,0,1,0,0,0,1,0,1,1],
  'F7':  [1,0,0,0,0,1,0,0,0,1,1,0],
  'G7':  [0,0,1,0,0,0,0,1,0,0,0,1],
  'A7':  [0,1,0,0,1,0,0,0,0,1,0,1],
  'B7':  [1,0,0,1,0,0,1,0,0,0,0,1],
  // Major 7th
  'Cmaj7': [1,0,0,0,1,0,0,1,0,0,0,1],
  'Fmaj7': [1,0,0,0,0,1,0,0,0,1,0,0],
  'Gmaj7': [0,0,1,0,0,0,0,1,0,0,0,1],
  'Amaj7': [0,1,0,0,1,0,0,0,0,1,0,0],
  // Minor 7th
  'Am7': [1,0,0,0,1,0,0,0,0,1,0,1],
  'Dm7': [0,0,1,0,0,1,0,0,0,1,0,1],
  'Em7': [0,0,0,0,1,0,0,1,0,0,1,0],
  // Suspended
  'Csus2': [1,0,1,0,0,0,0,1,0,0,0,0],
  'Csus4': [1,0,0,0,0,1,0,1,0,0,0,0],
  'Gsus4': [0,0,1,0,0,0,0,1,0,0,1,0],
  'Asus4': [0,1,0,0,0,1,0,0,0,1,0,0],
};

export interface ChordDetectionResult {
  chord: string;
  startTime: number;
  endTime: number;
  confidence: number;
  chroma: number[];
}

export interface AnalysisResult {
  chords: ChordDetectionResult[];
  bpm: number;
  key: string;
  keyConfidence: number;
  duration: number;
  beats: number[];
}

function hannWindow(size: number): Float32Array {
  const w = new Float32Array(size);
  for (let i = 0; i < size; i++) {
    w[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
  }
  return w;
}

function computeFFT(signal: Float32Array): Float32Array {
  const N = signal.length;
  if (N <= 1) return signal;

  const result = new Float32Array(N);
  // Use Web Audio OfflineAudioContext for FFT - we'll do simplified version here
  // Real part stored in even indices, imaginary in odd
  const re = new Float32Array(N);
  const im = new Float32Array(N);

  for (let i = 0; i < N; i++) {
    re[i] = signal[i];
    im[i] = 0;
  }

  // Cooley-Tukey FFT (radix-2)
  fftInPlace(re, im);

  // Return magnitude spectrum (first half)
  for (let i = 0; i < N / 2; i++) {
    result[i] = Math.sqrt(re[i] * re[i] + im[i] * im[i]);
  }
  return result;
}

function fftInPlace(re: Float32Array, im: Float32Array): void {
  const N = re.length;
  // Bit-reversal permutation
  let j = 0;
  for (let i = 1; i < N; i++) {
    let bit = N >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  // FFT butterfly
  for (let len = 2; len <= N; len <<= 1) {
    const ang = (2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = -Math.sin(ang);
    for (let i = 0; i < N; i += len) {
      let curRe = 1, curIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const uRe = re[i + k], uIm = im[i + k];
        const vRe = re[i + k + len / 2] * curRe - im[i + k + len / 2] * curIm;
        const vIm = re[i + k + len / 2] * curIm + im[i + k + len / 2] * curRe;
        re[i + k] = uRe + vRe;
        im[i + k] = uIm + vIm;
        re[i + k + len / 2] = uRe - vRe;
        im[i + k + len / 2] = uIm - vIm;
        const newCurRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = newCurRe;
      }
    }
  }
}

function freqToChromaBin(freq: number): number {
  if (freq <= 0) return -1;
  const A4 = 440.0;
  const semitones = 12 * Math.log2(freq / A4);
  return ((Math.round(semitones) % 12) + 12) % 12;
}

function computeChromagram(audioData: Float32Array, sampleRate: number, fftSize: number = 4096, hopSize: number = 2048): number[][] {
  const hann = hannWindow(fftSize);
  const chromaFrames: number[][] = [];
  const freqPerBin = sampleRate / fftSize;

  for (let start = 0; start + fftSize <= audioData.length; start += hopSize) {
    const frame = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      frame[i] = audioData[start + i] * hann[i];
    }

    const mag = computeFFT(frame);
    const chroma = new Array(12).fill(0);

    // Map FFT bins to chroma bins (only consider musically relevant range)
    const minFreq = 27.5; // A0
    const maxFreq = 4186; // C8

    for (let bin = 1; bin < fftSize / 2; bin++) {
      const freq = bin * freqPerBin;
      if (freq < minFreq || freq > maxFreq) continue;
      const chromaBin = freqToChromaBin(freq);
      if (chromaBin >= 0) {
        chroma[chromaBin] += mag[bin] * mag[bin];
      }
    }

    // Normalize
    const sum = chroma.reduce((a, b) => a + b, 0);
    if (sum > 0) {
      for (let i = 0; i < 12; i++) chroma[i] /= sum;
    }

    chromaFrames.push(chroma);
  }

  return chromaFrames;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < 12; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

function matchChord(chroma: number[]): { chord: string; confidence: number } {
  let bestChord = 'N/A';
  let bestScore = -1;

  for (const [chord, template] of Object.entries(CHORD_TEMPLATES)) {
    const score = cosineSimilarity(chroma, template);
    if (score > bestScore) {
      bestScore = score;
      bestChord = chord;
    }
  }

  return { chord: bestChord, confidence: bestScore };
}

function detectBeats(audioData: Float32Array, sampleRate: number): { bpm: number; beats: number[] } {
  // Compute energy envelope in frames
  const frameSize = 1024;
  const hopSize = 512;
  const energies: number[] = [];

  for (let i = 0; i + frameSize <= audioData.length; i += hopSize) {
    let energy = 0;
    for (let j = 0; j < frameSize; j++) {
      energy += audioData[i + j] ** 2;
    }
    energies.push(Math.sqrt(energy / frameSize));
  }

  // Onset detection: detect peaks in energy
  const onsets: number[] = [];
  const threshold = 0.05;
  const minInterval = Math.floor((sampleRate / hopSize) * 0.2); // min 200ms between beats

  for (let i = 2; i < energies.length - 2; i++) {
    const diff = energies[i] - energies[i - 1];
    if (diff > threshold &&
        energies[i] > energies[i-1] &&
        energies[i] > energies[i+1] &&
        (onsets.length === 0 || i - onsets[onsets.length - 1] > minInterval)) {
      onsets.push(i);
    }
  }

  // Estimate BPM via autocorrelation of inter-onset intervals
  if (onsets.length < 4) {
    return { bpm: 120, beats: [] };
  }

  const intervals: number[] = [];
  for (let i = 1; i < onsets.length; i++) {
    intervals.push((onsets[i] - onsets[i - 1]) * hopSize / sampleRate);
  }

  // Median interval in seconds
  intervals.sort((a, b) => a - b);
  const medianInterval = intervals[Math.floor(intervals.length / 2)];
  let bpm = Math.round(60 / medianInterval);

  // Keep BPM in musical range
  while (bpm < 60) bpm *= 2;
  while (bpm > 200) bpm /= 2;

  const beats = onsets.map(o => (o * hopSize) / sampleRate);
  return { bpm, beats };
}

// Krumhansl-Schmuckler key profiles
const KEY_PROFILES = {
  major: [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88],
  minor: [6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17],
};

export function detectKey(chromaFrames: number[][]): { key: string; confidence: number } {
  if (chromaFrames.length === 0) return { key: 'C Major', confidence: 0 };

  // Average chroma across all frames
  const avgChroma = new Array(12).fill(0);
  for (const frame of chromaFrames) {
    for (let i = 0; i < 12; i++) avgChroma[i] += frame[i];
  }
  for (let i = 0; i < 12; i++) avgChroma[i] /= chromaFrames.length;

  let bestKey = 'C';
  let bestMode = 'Major';
  let bestScore = -Infinity;

  for (let root = 0; root < 12; root++) {
    // Test major
    const majorProfile = KEY_PROFILES.major.map((_, i) => KEY_PROFILES.major[(i - root + 12) % 12]);
    const majorScore = cosineSimilarity(avgChroma, majorProfile);
    if (majorScore > bestScore) {
      bestScore = majorScore;
      bestKey = NOTE_NAMES[root];
      bestMode = 'Major';
    }
    // Test minor
    const minorProfile = KEY_PROFILES.minor.map((_, i) => KEY_PROFILES.minor[(i - root + 12) % 12]);
    const minorScore = cosineSimilarity(avgChroma, minorProfile);
    if (minorScore > bestScore) {
      bestScore = minorScore;
      bestKey = NOTE_NAMES[root];
      bestMode = 'Minor';
    }
  }

  return { key: `${bestKey} ${bestMode}`, confidence: bestScore };
}

function mergeConsecutiveChords(chords: ChordDetectionResult[]): ChordDetectionResult[] {
  if (chords.length === 0) return [];
  const merged: ChordDetectionResult[] = [{ ...chords[0] }];

  for (let i = 1; i < chords.length; i++) {
    const last = merged[merged.length - 1];
    if (chords[i].chord === last.chord) {
      last.endTime = chords[i].endTime;
      last.confidence = (last.confidence + chords[i].confidence) / 2;
    } else {
      merged.push({ ...chords[i] });
    }
  }
  return merged;
}

export async function analyzeAudio(audioBuffer: AudioBuffer): Promise<AnalysisResult> {
  // Mix down to mono
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const monoData = new Float32Array(length);

  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = audioBuffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      monoData[i] += channelData[i] / numChannels;
    }
  }

  const sampleRate = audioBuffer.sampleRate;
  const fftSize = 4096;
  const hopSize = 2048;
  const secondsPerHop = hopSize / sampleRate;

  // Compute chromagram
  const chromaFrames = computeChromagram(monoData, sampleRate, fftSize, hopSize);

  // Detect chords per frame
  const rawChords: ChordDetectionResult[] = chromaFrames.map((chroma, i) => {
    const { chord, confidence } = matchChord(chroma);
    return {
      chord,
      startTime: i * secondsPerHop,
      endTime: (i + 1) * secondsPerHop,
      confidence,
      chroma,
    };
  });

  // Merge consecutive same chords
  const chords = mergeConsecutiveChords(rawChords);

  // Beat detection
  const { bpm, beats } = detectBeats(monoData, sampleRate);

  // Key detection
  const { key, confidence: keyConfidence } = detectKey(chromaFrames);

  return {
    chords,
    bpm,
    key,
    keyConfidence,
    duration: audioBuffer.duration,
    beats,
  };
}
