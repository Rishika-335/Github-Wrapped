'use client'
import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import type { WrappedData } from '../lib/github'

export default function ShareSlide({ data }: { data: WrappedData }) {
  const [copying, setCopying] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const topLang = data.languages[0]?.name || 'Code'

  const shareText = `My GitHub Wrapped 2024 🎁\n\n${data.totalCommits.toLocaleString()} commits\n${data.longestStreak} day longest streak\n${topLang} is my #1 language\n\nGenerate yours 👇\ngithub-wrapped.vercel.app`

  const copyToClipboard = async () => {
    setCopying(true)
    await navigator.clipboard.writeText(shareText)
    setTimeout(() => setCopying(false), 2000)
  }

  const downloadImage = async () => {
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      if (!cardRef.current) return
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111118',
        scale: 2,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `github-wrapped-${data.user.login}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">Share your year</p>
        <h2 className="text-3xl font-bold text-white">Ready to post?</h2>
      </div>

      {/* Shareable card preview */}
      <div
        ref={cardRef}
        className="rounded-2xl p-6 border border-[#1DB954]/20 bg-[#111118]"
        style={{ background: '#111118' }}
      >
        <div className="flex items-center gap-3 mb-5">
          <img src={data.user.avatar_url} className="w-10 h-10 rounded-full" alt="" />
          <div>
            <p className="text-white font-bold text-sm">{data.user.name || data.user.login}</p>
            <p className="text-white/40 text-xs font-mono">@{data.user.login}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[#1DB954] text-xs font-mono font-bold">GITHUB WRAPPED 2024</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { v: data.totalCommits.toLocaleString(), l: 'Commits' },
            { v: data.longestStreak + 'd', l: 'Streak' },
            { v: data.totalStars.toLocaleString(), l: 'Stars' },
          ].map(({ v, l }) => (
            <div key={l} className="text-center bg-white/5 rounded-xl p-3">
              <div className="text-xl font-bold text-white">{v}</div>
              <div className="text-white/40 text-xs font-mono">{l}</div>
            </div>
          ))}
        </div>

        {topLang && (
          <div className="flex items-center gap-2">
            <span className="text-white/30 text-xs font-mono">#1 language</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#1DB954]/20 text-[#1DB954]">{topLang}</span>
          </div>
        )}

        {data.badges.slice(0, 2).map(b => (
          <span key={b} className="ml-2 px-2 py-0.5 rounded-full text-xs border border-white/10 text-white/40">{b}</span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={downloadImage}
          disabled={downloading}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-200"
          style={{
            background: downloading ? '#0F6E56' : '#1DB954',
            color: '#000',
            opacity: downloading ? 0.8 : 1,
          }}
        >
          {downloading ? 'Generating image...' : 'Download image'}
        </button>

        <button
          onClick={copyToClipboard}
          className="w-full py-3.5 rounded-xl font-bold text-sm border border-white/10 text-white/70 bg-white/5 hover:bg-white/10 transition-all duration-200"
        >
          {copying ? 'Copied!' : 'Copy LinkedIn post'}
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-4 border border-white/5">
        <p className="text-white/30 text-xs font-mono mb-2">POST PREVIEW</p>
        <p className="text-white/70 text-sm whitespace-pre-line leading-relaxed">{shareText}</p>
      </div>
    </motion.div>
  )
}
