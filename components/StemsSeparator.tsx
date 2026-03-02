'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mic2, Music, Waves, Headphones, Download, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface StemsSeparatorProps {
  audioBuffer: AudioBuffer | null
}

type StemStatus = 'idle' | 'processing' | 'done' | 'error'

interface Stem {
  id: string
  label: string
  icon: React.ReactNode
  color: string
  description: string
}

const STEMS: Stem[] = [
  { id: 'vocals', label: 'Vocals', icon: <Mic2 size={16} />, color: 'rose', description: 'Lead & backing vocals' },
  { id: 'bass', label: 'Bass', icon: <Waves size={16} />, color: 'indigo', description: 'Bass guitar & synth bass' },
  { id: 'drums', label: 'Drums', icon: <Music size={16} />, color: 'amber', description: 'Full percussion kit' },
  { id: 'other', label: 'Other', icon: <Headphones size={16} />, color: 'teal', description: 'Guitars, keys, synths' },
]

export default function StemsSeparator({ audioBuffer }: StemsSeparatorProps) {
  const [status, setStatus] = useState<StemStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [stemVolumes, setStemVolumes] = useState<Record<string, number>>({
    vocals: 100, bass: 100, drums: 100, other: 100,
  })

  const startSeparation = async () => {
    if (!audioBuffer) return
    setStatus('processing')
    setProgress(0)

    // Simulate processing (real impl would use Demucs API or ONNX model)
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 80))
      setProgress(i)
    }
    setStatus('done')
  }

  const handleVolumeChange = (stemId: string, value: number) => {
    setStemVolumes(prev => ({ ...prev, [stemId]: value }))
  }

  const colorMap: Record<string, string> = {
    rose: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  }

  const progressColorMap: Record<string, string> = {
    rose: 'bg-rose-500', indigo: 'bg-indigo-500', amber: 'bg-amber-500', teal: 'bg-teal-500',
  }

  if (!audioBuffer) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        Load an audio file first to separate stems.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-200">Instrument Separation</h3>
          <p className="text-sm text-slate-500">Separate your song into 4 individual stems</p>
        </div>
        {status === 'idle' && (
          <button
            onClick={startSeparation}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-sm rounded-xl hover:from-teal-400 hover:to-teal-500 transition-all shadow-lg shadow-teal-500/20"
          >
            Separate Stems
          </button>
        )}
        {status === 'processing' && (
          <div className="flex items-center gap-2 text-teal-400 text-sm">
            <Loader2 size={16} className="animate-spin" />
            Processing... {progress}%
          </div>
        )}
      </div>

      {status === 'processing' && (
        <div className="space-y-1">
          <div className="h-1.5 bg-obsidian-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-amber-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="text-xs text-slate-500 text-right">{progress}% complete</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {STEMS.map((stem, i) => (
          <motion.div
            key={stem.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={clsx(
              'rounded-xl border p-4 space-y-3',
              colorMap[stem.color],
              status !== 'done' && 'opacity-60'
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {stem.icon}
                <div>
                  <p className="text-sm font-semibold">{stem.label}</p>
                  <p className="text-xs opacity-60">{stem.description}</p>
                </div>
              </div>
              {status === 'done' && (
                <button
                  title={`Download ${stem.label}`}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <Download size={13} />
                </button>
              )}
            </div>

            {/* Volume slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs opacity-60">
                <span>Volume</span>
                <span>{stemVolumes[stem.id]}%</span>
              </div>
              <input
                type="range"
                min={0} max={100}
                value={stemVolumes[stem.id]}
                onChange={e => handleVolumeChange(stem.id, Number(e.target.value))}
                disabled={status !== 'done'}
                className="w-full"
              />
              {/* Mini waveform bar */}
              <div className="flex gap-0.5 items-end h-5">
                {Array.from({ length: 20 }).map((_, j) => (
                  <div
                    key={j}
                    className={clsx('flex-1 rounded-sm opacity-40', progressColorMap[stem.color])}
                    style={{ height: `${status === 'done' ? Math.random() * 16 + 4 : 3}px` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {status === 'done' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl"
        >
          <p className="text-sm text-teal-300">Stems separated successfully! Adjust volumes or download individually.</p>
          <button className="flex items-center gap-2 text-xs bg-teal-500 hover:bg-teal-400 text-obsidian-950 font-semibold px-3 py-1.5 rounded-lg transition-colors">
            <Download size={12} />
            Download All
          </button>
        </motion.div>
      )}
    </div>
  )
}
