'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music } from 'lucide-react'
import clsx from 'clsx'

interface ChordSyncDisplayProps {
  chords: Array<{ startTime: number; endTime: number; chord: string }>
  currentTime: number
  isPlaying: boolean
}

export default function ChordSyncDisplay({ chords, currentTime, isPlaying }: ChordSyncDisplayProps) {
  const [currentChord, setCurrentChord] = useState<string>('N/A')
  const [nextChord, setNextChord] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const prevChordRef = useRef<string>('')

  useEffect(() => {
    if (!chords.length) return

    // Encontrar o acorde atual baseado no tempo
    let current = chords[0]
    let next = null
    let currentIndex = 0

    for (let i = 0; i < chords.length; i++) {
      if (chords[i].startTime <= currentTime && currentTime < chords[i].endTime) {
        current = chords[i]
        currentIndex = i
        break
      }
    }

    // Próximo acorde
    if (currentIndex < chords.length - 1) {
      next = chords[currentIndex + 1]
    }

    // Calcular progresso até o próximo acorde
    if (next) {
      const duration = current.endTime - current.startTime
      const elapsed = currentTime - current.startTime
      setProgress(Math.min((elapsed / duration) * 100, 100))
      setNextChord(next.chord)
    } else {
      setProgress(100)
      setNextChord(null)
    }

    if (current.chord !== prevChordRef.current) {
      prevChordRef.current = current.chord
    }
    setCurrentChord(current.chord)
  }, [currentTime, chords])

  const getChordColor = (chord: string) => {
    if (chord === 'N/A') return 'text-slate-500'
    if (chord.includes('m') && !chord.includes('maj')) return 'text-teal-400'
    if (chord.includes('7')) return 'text-rose-400'
    return 'text-amber-400'
  }

  const getChordBg = (chord: string) => {
    if (chord === 'N/A') return 'bg-slate-500/10 border-slate-500/20'
    if (chord.includes('m') && !chord.includes('maj')) return 'bg-teal-500/10 border-teal-500/20'
    if (chord.includes('7')) return 'bg-rose-500/10 border-rose-500/20'
    return 'bg-amber-500/10 border-amber-500/20'
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Music size={16} />
        <span>Acorde Atual</span>
        {isPlaying && (
          <motion.div
            className="w-2 h-2 rounded-full bg-amber-500"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Acorde Atual */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentChord}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={clsx(
              'flex-1 flex items-center justify-center py-8 rounded-xl border-2',
              getChordBg(currentChord)
            )}
          >
            <span className={clsx('font-mono text-5xl font-bold', getChordColor(currentChord))}>
              {currentChord}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Próximo Acorde */}
        {nextChord && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500">Próximo</span>
            <div className={clsx(
              'px-4 py-2 rounded-lg border',
              getChordBg(nextChord)
            )}>
              <span className={clsx('font-mono text-xl font-semibold', getChordColor(nextChord))}>
                {nextChord}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Barra de progresso */}
      {nextChord && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progresso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
