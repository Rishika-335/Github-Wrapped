'use client'
import { motion } from 'framer-motion'
import type { WrappedData } from '../lib/github'

export default function PeakHoursSlide({ data }: { data: WrappedData }) {
  const max = Math.max(...data.hourlyActivity, 1)
  const formatHour = (h: number) => {
    if (h === 0) return '12a'
    if (h < 12) return `${h}a`
    if (h === 12) return '12p'
    return `${h - 12}p`
  }

  const peakLabel = (h: number) => {
    if (h >= 22 || h <= 4) return 'You\'re a night owl — shipping code when everyone else is asleep.'
    if (h >= 5 && h <= 9) return 'Early bird! You do your best work before the world wakes up.'
    if (h >= 9 && h <= 12) return 'Morning focus — you hit your stride when the coffee kicks in.'
    if (h >= 12 && h <= 14) return 'Lunch coder! Productive during the midday break.'
    return 'Afternoon/evening coder — you warm up as the day goes on.'
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
      <div>
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">Peak hours</p>
        <h2 className="text-3xl font-bold text-white">
          Your best hour: {formatHour(data.peakHour)}
        </h2>
        <p className="text-white/40 text-sm mt-2">{peakLabel(data.peakHour)}</p>
      </div>

      <div className="relative h-40">
        <div className="flex items-end gap-0.5 h-full">
          {data.hourlyActivity.map((count, hour) => {
            const height = max > 0 ? (count / max) * 100 : 0
            const isPeak = hour === data.peakHour
            return (
              <div key={hour} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <motion.div
                  className="w-full rounded-t-sm"
                  style={{
                    background: isPeak ? '#1DB954' : 'rgba(255,255,255,0.12)',
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 2)}%` }}
                  transition={{ delay: hour * 0.02, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  title={`${formatHour(hour)}: ${count} commits`}
                />
              </div>
            )
          })}
        </div>
        <div className="flex justify-between mt-2 text-white/20 text-xs font-mono px-0">
          <span>12a</span>
          <span>6a</span>
          <span>12p</span>
          <span>6p</span>
          <span>11p</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Morning', hours: '6a–12p', pct: Math.round((data.hourlyActivity.slice(6, 12).reduce((a, b) => a + b, 0) / Math.max(1, data.hourlyActivity.reduce((a, b) => a + b, 0))) * 100) },
          { label: 'Afternoon', hours: '12p–6p', pct: Math.round((data.hourlyActivity.slice(12, 18).reduce((a, b) => a + b, 0) / Math.max(1, data.hourlyActivity.reduce((a, b) => a + b, 0))) * 100) },
          { label: 'Night', hours: '10p–4a', pct: Math.round(([...data.hourlyActivity.slice(22), ...data.hourlyActivity.slice(0, 5)].reduce((a, b) => a + b, 0) / Math.max(1, data.hourlyActivity.reduce((a, b) => a + b, 0))) * 100) },
        ].map(({ label, hours, pct }) => (
          <div key={label} className="bg-white/5 rounded-2xl p-3 border border-white/5 text-center">
            <div className="text-xl font-bold text-white">{pct}%</div>
            <div className="text-white/40 text-xs font-mono mt-0.5">{label}</div>
            <div className="text-white/20 text-xs">{hours}</div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
