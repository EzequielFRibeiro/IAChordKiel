'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileDown, Edit3, Columns, AlignLeft, Save, X, Type, Loader2 } from 'lucide-react'
import clsx from 'clsx'
import jsPDF from 'jspdf'

interface ChordSheetEditorProps {
  chords: Array<{ startTime: number; endTime: number; chord: string }>
  lyrics?: string
  songTitle?: string
  artist?: string
  bpm?: number
  musicalKey?: string
}

export default function ChordSheetEditor({
  chords,
  lyrics = '',
  songTitle = 'Sem Título',
  artist = '',
  bpm,
  musicalKey
}: ChordSheetEditorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [editedLyrics, setEditedLyrics] = useState(lyrics)
  const [editedTitle, setEditedTitle] = useState(songTitle)
  const [editedArtist, setEditedArtist] = useState(artist)
  const [twoColumns, setTwoColumns] = useState(false)
  const [fontSize, setFontSize] = useState(12)
  const [isExporting, setIsExporting] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  // Gerar cifra com acordes sincronizados
  const generateChordSheet = () => {
    const lines: string[] = []
    const lyricsLines = editedLyrics.split('\n')
    
    // Se não houver letra, criar baseado nos acordes
    if (!editedLyrics.trim()) {
      let currentLine = ''
      chords.forEach((chord, idx) => {
        if (chord.chord !== 'N/A') {
          const timeStr = `[${Math.floor(chord.startTime)}s]`
          currentLine += `${timeStr} ${chord.chord}  `
          if ((idx + 1) % 4 === 0) {
            lines.push(currentLine.trim())
            currentLine = ''
          }
        }
      })
      if (currentLine) lines.push(currentLine.trim())
    } else {
      // Adicionar acordes sobre a letra
      lyricsLines.forEach(line => {
        lines.push(line)
      })
    }
    
    return lines.join('\n')
  }

  const exportToPDF = async () => {
    setIsExporting(true)
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - (margin * 2)
      const columnGap = 10

      let yPosition = margin

      // Título
      pdf.setFontSize(18)
      pdf.setFont('helvetica', 'bold')
      pdf.text(editedTitle, margin, yPosition)
      yPosition += 8

      // Artista
      if (editedArtist) {
        pdf.setFontSize(12)
        pdf.setFont('helvetica', 'normal')
        pdf.text(editedArtist, margin, yPosition)
        yPosition += 6
      }

      // Info (Tom e BPM)
      if (musicalKey || bpm) {
        pdf.setFontSize(10)
        pdf.setFont('helvetica', 'italic')
        const info = `Tom: ${musicalKey || 'N/A'}  |  BPM: ${bpm || 'N/A'}`
        pdf.text(info, margin, yPosition)
        yPosition += 8
      }

      // Linha separadora
      pdf.setDrawColor(200, 200, 200)
      pdf.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 8

      // Conteúdo
      pdf.setFontSize(fontSize)
      pdf.setFont('courier', 'normal')

      const chordSheet = generateChordSheet()
      const lines = chordSheet.split('\n')

      if (twoColumns) {
        // Layout em duas colunas
        const columnWidth = (contentWidth - columnGap) / 2
        const midPoint = Math.ceil(lines.length / 2)
        const leftColumn = lines.slice(0, midPoint)
        const rightColumn = lines.slice(midPoint)

        let leftY = yPosition
        let rightY = yPosition

        // Coluna esquerda
        leftColumn.forEach(line => {
          if (leftY > pageHeight - margin) {
            pdf.addPage()
            leftY = margin
          }
          pdf.text(line, margin, leftY, { maxWidth: columnWidth })
          leftY += fontSize * 0.5
        })

        // Coluna direita
        rightColumn.forEach(line => {
          if (rightY > pageHeight - margin) {
            pdf.addPage()
            rightY = margin
          }
          pdf.text(line, margin + columnWidth + columnGap, rightY, { maxWidth: columnWidth })
          rightY += fontSize * 0.5
        })
      } else {
        // Layout em uma coluna
        lines.forEach(line => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage()
            yPosition = margin
          }
          pdf.text(line, margin, yPosition, { maxWidth: contentWidth })
          yPosition += fontSize * 0.5
        })
      }

      // Rodapé
      const totalPages = (pdf as any).internal.getNumberOfPages()
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setFont('helvetica', 'normal')
        pdf.text(
          `Página ${i} de ${totalPages} - Gerado por ChordLens`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        )
      }

      // Salvar PDF
      const fileName = `${editedTitle.replace(/[^a-z0-9]/gi, '_')}_cifra.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error('Erro ao exportar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-obsidian-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
      >
        <FileDown size={18} />
        Exportar Cifra (PDF)
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-8 lg:inset-16 bg-obsidian-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Edit3 size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Editor de Cifra</h2>
                    <p className="text-sm text-slate-400">Edite e exporte sua cifra em PDF</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Informações da música */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <Type size={14} className="inline mr-1" />
                      Título da Música
                    </label>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full bg-obsidian-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      placeholder="Nome da música"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Artista
                    </label>
                    <input
                      type="text"
                      value={editedArtist}
                      onChange={(e) => setEditedArtist(e.target.value)}
                      className="w-full bg-obsidian-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20"
                      placeholder="Nome do artista"
                    />
                  </div>
                </div>

                {/* Editor de letra */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Letra da Música
                  </label>
                  <textarea
                    value={editedLyrics}
                    onChange={(e) => setEditedLyrics(e.target.value)}
                    rows={12}
                    className="w-full bg-obsidian-800 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 font-mono text-sm resize-none"
                    placeholder="Cole ou digite a letra da música aqui..."
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Dica: Os acordes serão adicionados automaticamente baseados na análise
                  </p>
                </div>

                {/* Opções de formatação */}
                <div className="glass rounded-xl p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-white">Opções de Formatação</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Layout */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">Layout</label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setTwoColumns(false)}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            !twoColumns
                              ? 'bg-amber-500 text-obsidian-950'
                              : 'bg-obsidian-800 text-slate-400 hover:text-white'
                          )}
                        >
                          <AlignLeft size={14} />
                          1 Coluna
                        </button>
                        <button
                          onClick={() => setTwoColumns(true)}
                          className={clsx(
                            'flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                            twoColumns
                              ? 'bg-amber-500 text-obsidian-950'
                              : 'bg-obsidian-800 text-slate-400 hover:text-white'
                          )}
                        >
                          <Columns size={14} />
                          2 Colunas
                        </button>
                      </div>
                    </div>

                    {/* Tamanho da fonte */}
                    <div>
                      <label className="block text-xs text-slate-400 mb-2">
                        Tamanho da Fonte: {fontSize}pt
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="16"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-center text-xs text-slate-400 space-y-1">
                      <div>Tom: <span className="text-amber-400">{musicalKey || 'N/A'}</span></div>
                      <div>BPM: <span className="text-amber-400">{bpm || 'N/A'}</span></div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="glass rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-white mb-3">Preview</h3>
                  <div
                    ref={previewRef}
                    className="bg-white text-black p-6 rounded-lg overflow-auto max-h-96"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <div className="font-bold text-xl mb-1">{editedTitle}</div>
                    {editedArtist && <div className="text-gray-600 mb-2">{editedArtist}</div>}
                    {(musicalKey || bpm) && (
                      <div className="text-sm text-gray-500 mb-4">
                        Tom: {musicalKey || 'N/A'} | BPM: {bpm || 'N/A'}
                      </div>
                    )}
                    <hr className="my-4 border-gray-300" />
                    <pre
                      className="font-mono whitespace-pre-wrap"
                      style={{
                        columnCount: twoColumns ? 2 : 1,
                        columnGap: '2rem'
                      }}
                    >
                      {generateChordSheet()}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={exportToPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-obsidian-950 font-semibold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  {isExporting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Gerando PDF...
                    </>
                  ) : (
                    <>
                      <FileDown size={18} />
                      Exportar PDF
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
