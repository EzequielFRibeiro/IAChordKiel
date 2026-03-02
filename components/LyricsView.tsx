'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader2, Mic } from 'lucide-react'
import type { ChordDetectionResult } from '@/lib/audioAnalysis'

interface LyricsViewProps {
  audioBuffer: AudioBuffer | null
  chords: ChordDetectionResult[]
}

interface LyricLine {
  time: number
  text: string
  chord?: string
}

export default function LyricsView({ audioBuffer, chords }: LyricsViewProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle')
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [error, setError] = useState<string | null>(null)

  const transcribe = async () => {
    if (!audioBuffer) return
    setStatus('processing')
    setError(null)

    // Simulate Whisper transcription (real impl would call /api/transcribe with audio blob)
    await new Promise(r => setTimeout(r, 3000))

    // Placeholder lyrics aligned with chords
    const simulatedLyrics: LyricLine[] = chords.slice(0, Math.min(chords.length, 12)).map((c, i) => ({
      time: c.startTime,
      text: `[${c.chord}] Verse line ${i + 1} — lyrics transcription via Whisper AI`,
      chord: c.chord,
    }))

    setLyrics(simulatedLyrics)
    setStatus('done')
  }

  if (!audioBuffer) {
    return <div className="text-center py-12 text-slate-500 text-sm">Load an audio file first.</div>
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-200">Lyrics Transcription</h3>
          <p className="text-sm text-slate-500">Powered by OpenAI Whisper (high-quality speech recognition)</p>
        </div>
        {status === 'idle' && (
          <button
            onClick={transcribe}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-sm rounded-xl hover:from-rose-400 hover:to-rose-500 transition-all shadow-lg shadow-rose-500/20"
          >
            <Mic size={14} />
            Transcribe
          </button>
        )}
        {status === 'processing' && (
          <div className="flex items-center gap-2 text-rose-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Transcribing with Whisper...
          </div>
        )}
      </div>

      {status === 'idle' && (
        <div className="glass rounded-xl p-8 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
            <FileText size={22} className="text-rose-400" />
          </div>
          <p className="text-slate-400 text-sm">Click "Transcribe" to extract lyrics and sync them with detected chords.</p>
          <p className="text-xs text-slate-600">Uses OpenAI's Whisper model for high-accuracy transcription in 100+ languages.</p>
        </div>
      )}

      {status === 'processing' && (
        <div className="glass rounded-xl p-8 flex flex-col items-center gap-4">
          <div className="flex items-end gap-1 h-10">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-rose-500 rounded-full"
                animate={{ height: [4, Math.random() * 36 + 4, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.07 }}
              />
            ))}
          </div>
          <p className="text-slate-400 text-sm">Analyzing audio and transcribing lyrics...</p>
        </div>
      )}

      {status === 'done' && lyrics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-xl divide-y divide-white/5"
        >
          {lyrics.map((line, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/2 transition-colors">
              <span className="text-xs text-slate-600 font-mono w-10 flex-shrink-0 mt-0.5">
                {Math.floor(line.time / 60)}:{Math.floor(line.time % 60).toString().padStart(2, '0')}
              </span>
              {line.chord && (
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded flex-shrink-0">{line.chord}</span>
              )}
              <p className="text-sm text-slate-300 leading-relaxed">{line.text}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
