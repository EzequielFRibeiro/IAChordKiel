'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Piano, Download, Loader2 } from 'lucide-react'
import type { ChordDetectionResult } from '@/lib/audioAnalysis'

interface MidiExportProps {
  chords: ChordDetectionResult[]
  bpm: number
}

// Map chord name to MIDI note numbers (root note)
const CHORD_TO_MIDI: Record<string, number[]> = {
  'C': [60, 64, 67], 'Cm': [60, 63, 67], 'C7': [60, 64, 67, 70],
  'D': [62, 66, 69], 'Dm': [62, 65, 69], 'D7': [62, 66, 69, 72],
  'E': [64, 68, 71], 'Em': [64, 67, 71], 'E7': [64, 68, 71, 74],
  'F': [65, 69, 72], 'Fm': [65, 68, 72], 'F7': [65, 69, 72, 75],
  'G': [67, 71, 74], 'Gm': [67, 70, 74], 'G7': [67, 71, 74, 77],
  'A': [69, 73, 76], 'Am': [69, 72, 76], 'A7': [69, 73, 76, 79],
  'B': [71, 75, 78], 'Bm': [71, 74, 78], 'B7': [71, 75, 78, 81],
}

function writeMidi(chords: ChordDetectionResult[], bpm: number): Uint8Array {
  const ticksPerBeat = 480
  const microsecondsPerBeat = Math.round(60000000 / bpm)

  const bytes: number[] = []
  const push = (...vals: number[]) => bytes.push(...vals)
  const pushUint32 = (v: number) => push((v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff)
  const pushUint16 = (v: number) => push((v >>> 8) & 0xff, v & 0xff)

  const varLen = (v: number): number[] => {
    const result = []
    result.unshift(v & 0x7f)
    v >>= 7
    while (v > 0) { result.unshift((v & 0x7f) | 0x80); v >>= 7 }
    return result
  }

  // Track data
  const track: number[] = []
  const tpush = (...vals: number[]) => track.push(...vals)

  // Tempo event
  tpush(...varLen(0), 0xff, 0x51, 0x03,
    (microsecondsPerBeat >>> 16) & 0xff,
    (microsecondsPerBeat >>> 8) & 0xff,
    microsecondsPerBeat & 0xff)

  for (const chord of chords) {
    if (chord.chord === 'N/A') continue
    const notes = CHORD_TO_MIDI[chord.chord] || [60, 64, 67]
    const duration = Math.round((chord.endTime - chord.startTime) * ticksPerBeat * bpm / 60)

    // Note on (delta 0 for each note in chord)
    for (let i = 0; i < notes.length; i++) {
      tpush(...varLen(i === 0 ? 0 : 0), 0x90, notes[i], 80)
    }

    // Note off after duration
    for (let i = 0; i < notes.length; i++) {
      tpush(...varLen(i === 0 ? duration : 0), 0x80, notes[i], 0)
    }
  }

  // End of track
  tpush(...varLen(0), 0xff, 0x2f, 0x00)

  // Header
  push(0x4d, 0x54, 0x68, 0x64) // MThd
  pushUint32(6)
  pushUint16(0) // format 0
  pushUint16(1) // 1 track
  pushUint16(ticksPerBeat)

  // Track chunk
  push(0x4d, 0x54, 0x72, 0x6b) // MTrk
  pushUint32(track.length)
  push(...track)

  return new Uint8Array(bytes)
}

export default function MidiExport({ chords, bpm }: MidiExportProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async () => {
    if (chords.length === 0) return
    setIsGenerating(true)
    await new Promise(r => setTimeout(r, 500))

    const midi = writeMidi(chords, bpm)
    const blob = new Blob([midi.buffer as ArrayBuffer], { type: 'audio/midi' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chords.mid'
    a.click()
    URL.revokeObjectURL(url)
    setIsGenerating(false)
  }

  if (chords.length === 0) {
    return <div className="text-center py-12 text-slate-500 text-sm">Analyze a song first to export MIDI.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-200">MIDI Export</h3>
          <p className="text-sm text-slate-500">Convert detected chords to a MIDI file for your DAW</p>
        </div>
        <button
          onClick={handleExport}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold text-sm rounded-xl hover:from-indigo-400 hover:to-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
        >
          {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
          Export MIDI
        </button>
      </div>

      {/* Preview */}
      <div className="glass rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 mb-1">
          <Piano size={16} />
          <span className="text-sm font-medium">Chord Preview</span>
          <span className="text-xs text-slate-500 ml-auto">{chords.filter(c => c.chord !== 'N/A').length} chords · {bpm} BPM</span>
        </div>

        {/* Piano roll preview */}
        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-2">
            {chords
              .filter(c => c.chord !== 'N/A')
              .slice(0, 24)
              .map((c, i) => {
                const notes = CHORD_TO_MIDI[c.chord] || []
                const width = Math.max(40, (c.endTime - c.startTime) * 60)
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex-shrink-0 rounded-lg bg-indigo-500/15 border border-indigo-500/25 p-2 flex flex-col gap-1"
                    style={{ width }}
                  >
                    <span className="text-xs font-mono font-bold text-indigo-300 truncate">{c.chord}</span>
                    <div className="flex gap-0.5">
                      {notes.map(n => (
                        <div key={n} className="w-1.5 rounded-sm bg-indigo-400"
                          style={{ height: `${(n - 50) / 2}px`, maxHeight: 16, minHeight: 4 }} />
                      ))}
                    </div>
                  </motion.div>
                )
              })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Format', value: 'MIDI Type 0' },
          { label: 'Tempo', value: `${bpm} BPM` },
          { label: 'Tracks', value: '1 (Chords)' },
        ].map(item => (
          <div key={item.label} className="glass rounded-xl p-3 border border-white/5">
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
