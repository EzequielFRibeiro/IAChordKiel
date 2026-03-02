import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const displayFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChordLens — AI Chord Detection',
  description: 'Detect chords, beats, and key from any song using AI. Supports file upload, microphone, and YouTube URLs.',
  keywords: 'chord detection, music analysis, AI, guitar chords, beat tracking, key detection',
  openGraph: {
    title: 'ChordLens — AI Chord Detection',
    description: 'Detect chords, beats, and key from any song',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <body className="font-body antialiased bg-obsidian-950 text-slate-100">
        {children}
      </body>
    </html>
  )
}
