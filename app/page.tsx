'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { WrappedData } from './lib/github'
import WrappedViewer from './components/WrappedViewer'

const EXAMPLES = ['torvalds', 'gaearon', 'sindresorhus', 'yyx990803', 'nicolo-ribaudo']

export default function Home() {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<WrappedData | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const generate = async (u?: string) => {
    const name = (u || username).trim()
    if (!name) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(name)}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed')
      setData(json)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (data) return <WrappedViewer data={data} onReset={() => { setData(null); setUsername('') }} />

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <AnimatePresence>
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1DB954] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="black">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">GitHub Wrapped</span>
            </div>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Your year<br />in code
            </h1>
            <p className="text-white/40 mt-3 text-sm">
              Spotify Wrapped, but for your GitHub
            </p>
          </div>

          {/* Input */}
          <div className="relative mb-3">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-mono text-sm">
              github.com/
            </div>
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="username"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-white placeholder-white/20 font-mono text-sm outline-none focus:border-[#1DB954]/50 transition-colors pl-[116px]"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm font-mono mb-3 text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            onClick={() => generate()}
            disabled={loading || !username.trim()}
            className="w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 mb-6"
            style={{
              background: loading || !username.trim() ? 'rgba(255,255,255,0.05)' : '#1DB954',
              color: loading || !username.trim() ? 'rgba(255,255,255,0.3)' : '#000',
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Fetching your data...
              </span>
            ) : 'Generate my Wrapped →'}
          </button>

          {/* Examples */}
          <div>
            <p className="text-white/20 text-xs font-mono text-center mb-3">try an example</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => { setUsername(ex); generate(ex) }}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono text-white/40 border border-white/10 hover:border-white/20 hover:text-white/70 transition-all"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <p className="absolute bottom-6 text-white/15 text-xs font-mono">
        uses public github api · no login required
      </p>
    </div>
  )
}
