'use client'
import { motion } from 'framer-motion'
import type { WrappedData } from '../lib/github'

export default function StreakSlide({ data }: { data: WrappedData }) {
  const commitSet = new Set(data.commitDays)

  // Build last 28 days grid for display
  const today = new Date()
  const days: { date: string; active: boolean }[] = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const str = d.toISOString().split('T')[0]
    days.push({ date: str, active: commitSet.has(str) })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">Commit streaks</p>
        <h2 className="text-3xl font-bold text-white">Consistency is king</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
          <motion.div
            className="text-5xl font-bold text-[#1DB954]"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.longestStreak}
          </motion.div>
          <div className="text-white/40 text-xs font-mono tracking-wider mt-2">LONGEST STREAK</div>
          <div className="text-white/20 text-xs mt-1">days</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-5 border border-white/5 text-center">
          <motion.div
            className="text-5xl font-bold text-white"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {data.currentStreak}
          </motion.div>
          <div className="text-white/40 text-xs font-mono tracking-wider mt-2">CURRENT STREAK</div>
          <div className="text-white/20 text-xs mt-1">days</div>
        </div>
      </div>

      <div>
        <p className="text-white/30 text-xs font-mono mb-3">LAST 28 DAYS</p>
        <div className="grid grid-cols-7 gap-1.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-white/20 text-xs font-mono pb-1">{d}</div>
          ))}
          {days.map((day, i) => (
            <motion.div
              key={day.date}
              className="aspect-square rounded-md"
              style={{ background: day.active ? '#1DB954' : 'rgba(255,255,255,0.05)' }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.015, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              title={day.date}
            />
          ))}
        </div>
      </div>

      <div className="text-white/20 text-xs font-mono text-center">
        {data.commitDays.length} active days tracked from public events
      </div>
    </motion.div>
  )
}
