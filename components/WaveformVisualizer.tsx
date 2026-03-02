'use client'

import { useEffect, useRef, useCallback } from 'react'

interface WaveformVisualizerProps {
  audioBuffer: AudioBuffer | null
  currentTime: number
  duration: number
  beats: number[]
  onSeek: (time: number) => void
}

export default function WaveformVisualizer({
  audioBuffer,
  currentTime,
  duration,
  beats,
  onSeek,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !audioBuffer) return

    const dpr = window.devicePixelRatio || 1
    const width = container.clientWidth
    const height = container.clientHeight

    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')!
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    // Get waveform data
    const data = audioBuffer.getChannelData(0)
    const step = Math.ceil(data.length / width)
    const amp = height / 2

    // Draw beat markers
    ctx.fillStyle = 'rgba(245, 158, 11, 0.08)'
    for (const beat of beats) {
      const x = (beat / duration) * width
      ctx.fillRect(x - 0.5, 0, 1, height)
    }

    // Draw played region
    const playedWidth = (currentTime / duration) * width
    ctx.fillStyle = 'rgba(245, 158, 11, 0.05)'
    ctx.fillRect(0, 0, playedWidth, height)

    // Draw waveform bars
    for (let i = 0; i < width; i++) {
      let min = 1.0, max = -1.0
      const sliceStart = i * step
      for (let j = 0; j < step; j++) {
        const datum = data[sliceStart + j] ?? 0
        if (datum < min) min = datum
        if (datum > max) max = datum
      }

      const isPlayed = i < playedWidth
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      if (isPlayed) {
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.15)')
        gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.8)')
        gradient.addColorStop(1, 'rgba(245, 158, 11, 0.15)')
      } else {
        gradient.addColorStop(0, 'rgba(100, 130, 170, 0.08)')
        gradient.addColorStop(0.5, 'rgba(100, 130, 170, 0.4)')
        gradient.addColorStop(1, 'rgba(100, 130, 170, 0.08)')
      }
      ctx.fillStyle = gradient
      ctx.fillRect(i, amp - max * amp, 1, Math.max(1, (max - min) * amp))
    }

    // Draw playhead
    const playX = (currentTime / duration) * width
    const lineGrad = ctx.createLinearGradient(0, 0, 0, height)
    lineGrad.addColorStop(0, 'transparent')
    lineGrad.addColorStop(0.2, '#f59e0b')
    lineGrad.addColorStop(0.8, '#f59e0b')
    lineGrad.addColorStop(1, 'transparent')
    ctx.strokeStyle = lineGrad
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(playX, 0)
    ctx.lineTo(playX, height)
    ctx.stroke()

    // Playhead diamond
    ctx.fillStyle = '#f59e0b'
    ctx.beginPath()
    ctx.moveTo(playX, 4)
    ctx.lineTo(playX + 4, 10)
    ctx.lineTo(playX, 16)
    ctx.lineTo(playX - 4, 10)
    ctx.closePath()
    ctx.fill()
  }, [audioBuffer, currentTime, duration, beats])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => drawWaveform())
    observer.observe(container)
    return () => observer.disconnect()
  }, [drawWaveform])

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!duration) return
    const rect = canvasRef.current!.getBoundingClientRect()
    const x = e.clientX - rect.left
    const time = (x / rect.width) * duration
    onSeek(time)
  }

  if (!audioBuffer) {
    return (
      <div className="w-full h-24 bg-obsidian-800/40 rounded-xl border border-white/5 flex items-center justify-center">
        <p className="text-xs text-slate-600">Load audio to see waveform</p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="w-full h-24 relative cursor-pointer">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-xl"
        onClick={handleClick}
        style={{ background: 'rgba(8,13,20,0.6)' }}
      />
    </div>
  )
}
