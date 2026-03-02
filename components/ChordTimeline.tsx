'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ChordDetectionResult } from '@/lib/audioAnalysis'
import clsx from 'clsx'

interface ChordTimelineProps {
  chords: ChordDetectionResult[]
  currentTime: number
  duration: number
  onChordClick: (chord: string) => void
  onSeek: (time: number) => void
}

function getChordColor(chord: string): string {
  if (chord === 'N/A') return 'bg-slate-800/50 text-slate-500 border-white/5'
  if (chord.includes('maj7')) return 'bg-teal-500/15 text-teal-300 border-teal-500/25'
  if (chord.includes('m7') || chord.includes('min7')) return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25'
  if (chord.includes('7')) return 'bg-rose-500/15 text-rose-300 border-rose-500/25'
  if (chord.includes('m') && !chord.includes('maj')) return 'bg-blue-500/15 text-blue-300 border-blue-500/25'
  if (chord.includes('sus')) return 'bg-purple-500/15 text-purple-300 border-purple-500/25'
  return 'bg-amber-500/15 text-amber-300 border-amber-500/25'
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function ChordTimeline({ chords, currentTime, duration, onChordClick, onSeek }: ChordTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  // Find active chord
  const activeIndex = chords.findIndex(
    c => currentTime >= c.startTime && currentTime < c.endTime
  )

  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeIndex])

  if (chords.length === 0) return null

  return (
    <div className="space-y-3">
      {/* Timeline scroll */}
      <div
        ref={containerRef}
        className="overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex gap-1.5 min-w-max">
          {chords.map((c, i) => {
            const widthRatio = (c.endTime - c.startTime) / duration
            const isActive = i === activeIndex
            const minWidth = 60
            const calcWidth = Math.max(minWidth, widthRatio * 800)

            return (
              <motion.div
                key={i}
                ref={isActive ? activeRef : null}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.01 }}
                onClick={() => { onSeek(c.startTime); onChordClick(c.chord) }}
                className={clsx(
                  'flex-shrink-0 flex flex-col items-center justify-center cursor-pointer rounded-lg border transition-all duration-150 select-none',
                  getChordColor(c.chord),
                  isActive ? 'ring-1 ring-amber-400/60 scale-105 shadow-lg' : 'hover:scale-102 hover:brightness-110',
                )}
                style={{ width: calcWidth, minHeight: 52 }}
              >
                <span className="font-mono font-bold text-sm leading-tight">{c.chord}</span>
                <span className="text-xs opacity-50 mt-0.5">{formatTime(c.startTime)}</span>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Chord list view */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {chords
          .filter((c, i, arr) => arr.findIndex(x => x.chord === c.chord) === i)
          .filter(c => c.chord !== 'N/A')
          .slice(0, 12)
          .map((c, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => onChordClick(c.chord)}
              className={clsx(
                'chord-pill py-2 text-sm font-mono font-semibold border rounded-lg transition-all hover:brightness-125',
                getChordColor(c.chord)
              )}
            >
              {c.chord}
            </motion.button>
          ))}
      </div>
    </div>
  )
}
