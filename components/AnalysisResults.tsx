'use client'

import { motion } from 'framer-motion'
import { Music, Drum, Key, Clock } from 'lucide-react'
import clsx from 'clsx'

interface AnalysisResultsProps {
  bpm: number
  musicalKey: string
  keyConfidence: number
  duration: number
  totalChords: number
  uniqueChords: number
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AnalysisResults({
  bpm,
  musicalKey,
  keyConfidence,
  duration,
  totalChords,
  uniqueChords,
}: AnalysisResultsProps) {
  const stats = [
    {
      icon: <Key size={16} />,
      label: 'Musical Key',
      value: musicalKey,
      sub: `${Math.round(keyConfidence * 100)}% confidence`,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20',
    },
    {
      icon: <Drum size={16} />,
      label: 'Tempo',
      value: `${bpm} BPM`,
      sub: bpm < 80 ? 'Slow' : bpm < 120 ? 'Moderate' : bpm < 160 ? 'Fast' : 'Very Fast',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
    },
    {
      icon: <Music size={16} />,
      label: 'Chords',
      value: `${uniqueChords} unique`,
      sub: `${totalChords} total sections`,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
    },
    {
      icon: <Clock size={16} />,
      label: 'Duration',
      value: formatDuration(duration),
      sub: `${duration.toFixed(1)}s`,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'border-indigo-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className={clsx(
            'rounded-xl border p-4 flex flex-col gap-2',
            stat.bg, stat.border
          )}
        >
          <div className={clsx('flex items-center gap-2', stat.color)}>
            {stat.icon}
            <span className="text-xs font-medium opacity-75">{stat.label}</span>
          </div>
          <div>
            <p className={clsx('text-xl font-bold font-display tracking-tight', stat.color)}>
              {stat.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
