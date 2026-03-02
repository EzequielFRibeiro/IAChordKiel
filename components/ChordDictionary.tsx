'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CHORD_LIBRARY, CHORD_CATEGORIES, findChord, type ChordInfo } from '@/lib/chordData'
import clsx from 'clsx'
import { X } from 'lucide-react'

type Instrument = 'guitar' | 'piano' | 'ukulele'

// ---- Guitar Diagram ----
function GuitarDiagram({ chord }: { chord: ChordInfo }) {
  const pos = chord.guitar
  if (!pos) return <p className="text-xs text-slate-500 text-center py-4">No guitar data</p>

  const baseFret = pos.baseFret || 1
  const numFrets = 5
  const strings = 6
  const fretW = 32, fretH = 28, padX = 24, padY = 24

  const svgW = padX * 2 + fretW * (strings - 1)
  const svgH = padY * 2 + fretH * numFrets + 20

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[160px] mx-auto">
      {/* Nut or base fret label */}
      {baseFret === 1 ? (
        <rect x={padX} y={padY - 3} width={fretW * (strings - 1)} height={5} fill="#94a3b8" rx={2} />
      ) : (
        <text x={padX - 4} y={padY + fretH / 2} textAnchor="end" fontSize={9} fill="#64748b">{baseFret}fr</text>
      )}

      {/* Fret lines */}
      {Array.from({ length: numFrets + 1 }).map((_, f) => (
        <line key={f} x1={padX} y1={padY + f * fretH} x2={padX + fretW * (strings - 1)} y2={padY + f * fretH}
          stroke="#1e2d40" strokeWidth={1} />
      ))}

      {/* String lines */}
      {Array.from({ length: strings }).map((_, s) => (
        <line key={s} x1={padX + s * fretW} y1={padY} x2={padX + s * fretW} y2={padY + numFrets * fretH}
          stroke="#1e2d40" strokeWidth={1} />
      ))}

      {/* Barre */}
      {pos.barres?.map((b, i) => {
        const fromX = padX + (strings - 1 - b.fromString) * fretW
        const toX = padX + (strings - 1 - b.toString) * fretW
        const y = padY + (b.fret - baseFret + 0.5) * fretH
        return <rect key={i} x={Math.min(fromX, toX)} y={y - 7} width={Math.abs(fromX - toX)} height={14}
          rx={7} fill="#f59e0b" opacity={0.85} />
      })}

      {/* Fret dots */}
      {pos.frets.map((fret, s) => {
        const x = padX + (strings - 1 - s) * fretW
        if (fret === -1) {
          return <text key={s} x={x} y={padY - 12} textAnchor="middle" fontSize={11} fill="#ef4444">✕</text>
        }
        if (fret === 0) {
          return <circle key={s} cx={x} cy={padY - 12} r={5} fill="none" stroke="#64748b" strokeWidth={1.5} />
        }
        const y = padY + (fret - baseFret + 0.5) * fretH
        const isBarred = pos.barres?.some(b => b.fret === fret + baseFret - 1 && s >= b.toString && s <= b.fromString)
        if (isBarred) return null
        return <circle key={s} cx={x} cy={y} r={8} fill="#f59e0b" />
      })}

      {/* String numbers */}
      {['E','A','D','G','B','e'].map((n, s) => (
        <text key={s} x={padX + (strings - 1 - s) * fretW} y={svgH - 4}
          textAnchor="middle" fontSize={8} fill="#475569">{n}</text>
      ))}
    </svg>
  )
}

// ---- Piano Diagram ----
const WHITE_NOTES = ['C','D','E','F','G','A','B']
const BLACK_NOTES: Record<string, number> = { 'C#': 0.67, 'D#': 1.67, 'F#': 3.67, 'G#': 4.67, 'A#': 5.67 }
const NOTE_ENHARMONICS: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
}

function PianoDiagram({ chord }: { chord: ChordInfo }) {
  const notes = chord.piano?.notes ?? []
  const activeNotes = new Set(notes.map(n => n.replace(/\d/g, '')).map(n => NOTE_ENHARMONICS[n] || n))

  const wW = 28, wH = 80
  const bW = 18, bH = 50
  const totalWidth = wW * 8

  return (
    <svg viewBox={`0 0 ${totalWidth} ${wH + 16}`} className="w-full max-w-[240px] mx-auto">
      {/* White keys */}
      {WHITE_NOTES.map((note, i) => {
        const isActive = activeNotes.has(note)
        return (
          <g key={note}>
            <rect x={i * wW + 1} y={0} width={wW - 2} height={wH} rx={3}
              fill={isActive ? '#f59e0b' : '#e8e0d0'} stroke="#999" strokeWidth={0.5} />
            <text x={i * wW + wW / 2} y={wH + 12} textAnchor="middle" fontSize={8} fill="#64748b">{note}</text>
          </g>
        )
      })}
      {/* Black keys */}
      {Object.entries(BLACK_NOTES).map(([note, pos]) => {
        const isActive = activeNotes.has(note)
        return (
          <rect key={note} x={pos * wW + wW / 2 - bW / 2} y={0} width={bW} height={bH} rx={2}
            fill={isActive ? '#f59e0b' : '#1a1a2e'} />
        )
      })}
    </svg>
  )
}

// ---- Ukulele Diagram ----
function UkuleleDiagram({ chord }: { chord: ChordInfo }) {
  const pos = chord.ukulele
  if (!pos) return <p className="text-xs text-slate-500 text-center py-4">No ukulele data</p>

  const strings = 4, numFrets = 4
  const fretW = 32, fretH = 28, padX = 24, padY = 24
  const svgW = padX * 2 + fretW * (strings - 1)
  const svgH = padY * 2 + fretH * numFrets + 20

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full max-w-[140px] mx-auto">
      <rect x={padX} y={padY - 3} width={fretW * (strings - 1)} height={5} fill="#94a3b8" rx={2} />
      {Array.from({ length: numFrets + 1 }).map((_, f) => (
        <line key={f} x1={padX} y1={padY + f * fretH} x2={padX + fretW * (strings - 1)} y2={padY + f * fretH}
          stroke="#1e2d40" strokeWidth={1} />
      ))}
      {Array.from({ length: strings }).map((_, s) => (
        <line key={s} x1={padX + s * fretW} y1={padY} x2={padX + s * fretW} y2={padY + numFrets * fretH}
          stroke="#1e2d40" strokeWidth={1} />
      ))}
      {pos.frets.map((fret, s) => {
        const x = padX + s * fretW
        if (fret === 0) return <circle key={s} cx={x} cy={padY - 12} r={5} fill="none" stroke="#64748b" strokeWidth={1.5} />
        return <circle key={s} cx={x} cy={padY + (fret - 0.5) * fretH} r={8} fill="#f59e0b" />
      })}
      {['G','C','E','A'].map((n, s) => (
        <text key={s} x={padX + s * fretW} y={svgH - 4} textAnchor="middle" fontSize={8} fill="#475569">{n}</text>
      ))}
    </svg>
  )
}

// ---- Main Dictionary ----
interface ChordDictionaryProps {
  highlightChord?: string | null
}

export default function ChordDictionary({ highlightChord }: ChordDictionaryProps) {
  const [instrument, setInstrument] = useState<Instrument>('guitar')
  const [selectedChord, setSelectedChord] = useState<string | null>(highlightChord || null)
  const [search, setSearch] = useState('')

  const chord = selectedChord ? findChord(selectedChord) : null

  const filtered = search.trim()
    ? CHORD_LIBRARY.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.displayName.toLowerCase().includes(search.toLowerCase()))
    : CHORD_LIBRARY

  return (
    <div className="space-y-4">
      {/* Instrument picker */}
      <div className="flex gap-2">
        {(['guitar', 'piano', 'ukulele'] as Instrument[]).map(ins => (
          <button
            key={ins}
            onClick={() => setInstrument(ins)}
            className={clsx(
              'px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all',
              instrument === ins
                ? 'bg-amber-500 text-obsidian-950'
                : 'bg-obsidian-800/40 text-slate-400 hover:text-slate-200 border border-white/5'
            )}
          >
            {ins}
          </button>
        ))}
      </div>

      <div className="flex gap-4 flex-col lg:flex-row">
        {/* Chord list */}
        <div className="lg:w-64 flex-shrink-0 space-y-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chords..."
            className="w-full bg-obsidian-800/60 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
          />

          {CHORD_CATEGORIES.map(cat => (
            <div key={cat.label}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{cat.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.chords
                  .filter(n => !search || n.toLowerCase().includes(search.toLowerCase()))
                  .map(name => (
                    <button
                      key={name}
                      onClick={() => setSelectedChord(name)}
                      className={clsx(
                        'text-xs font-mono font-semibold px-2.5 py-1.5 rounded-lg border transition-all',
                        selectedChord === name
                          ? 'bg-amber-500 text-obsidian-950 border-amber-400'
                          : 'bg-obsidian-800/40 text-slate-300 border-white/5 hover:border-amber-500/30 hover:text-amber-300'
                      )}
                    >
                      {name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Chord detail */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {chord ? (
              <motion.div
                key={chord.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="glass rounded-xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-amber-400">{chord.name}</h3>
                    <p className="text-sm text-slate-400">{chord.displayName}</p>
                    <div className="flex gap-2 mt-2">
                      {chord.notes.map(n => (
                        <span key={n} className="text-xs bg-obsidian-800 border border-white/10 rounded px-2 py-0.5 font-mono text-slate-300">{n}</span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => setSelectedChord(null)} className="text-slate-500 hover:text-slate-300">
                    <X size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-center py-4">
                  {instrument === 'guitar' && <GuitarDiagram chord={chord} />}
                  {instrument === 'piano' && <PianoDiagram chord={chord} />}
                  {instrument === 'ukulele' && <UkuleleDiagram chord={chord} />}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <span className="text-2xl">🎸</span>
                </div>
                <p className="text-slate-400 text-sm">Select a chord to see the diagram</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
