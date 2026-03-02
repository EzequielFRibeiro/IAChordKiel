'use client'

import { motion } from 'framer-motion'
import { Music2, Zap, Github } from 'lucide-react'

export default function Header() {
  return (
    <header className="relative z-10 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Music2 size={16} className="text-obsidian-950" />
          </div>
          <span className="font-display text-xl font-bold text-white tracking-tight">
            Chord<span className="text-amber-400">Lens</span>
          </span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hidden md:flex items-center gap-6 text-sm"
        >
          <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
          <a href="#dictionary" className="text-slate-400 hover:text-white transition-colors">Chord Dictionary</a>
          <a href="#about" className="text-slate-400 hover:text-white transition-colors">About</a>
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-3"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
          <div className="flex items-center gap-1.5 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <Zap size={11} fill="currentColor" />
            <span>AI Powered</span>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
