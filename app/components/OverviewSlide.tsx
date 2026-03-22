'use client'
import { motion } from 'framer-motion'
import type { WrappedData } from '../lib/github'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

export default function OverviewSlide({ data }: { data: WrappedData }) {
  const formatHour = (h: number) => {
    if (h === 0) return '12am'
    if (h < 12) return `${h}am`
    if (h === 12) return '12pm'
    return `${h - 12}pm`
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={item} className="flex items-center gap-4">
        <img
          src={data.user.avatar_url}
          alt={data.user.login}
          className="w-16 h-16 rounded-full border-2 border-white/10"
        />
        <div>
          <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">GitHub Wrapped 2024</p>
          <h2 className="text-2xl font-bold text-white leading-tight">
            {data.user.name || data.user.login}
          </h2>
          <p className="text-white/40 text-sm">@{data.user.login} · joined {data.yearJoined}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Commits', value: data.totalCommits.toLocaleString() },
          { label: 'Repos', value: data.totalRepos },
          { label: 'Stars', value: data.totalStars.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white/5 rounded-2xl p-4 text-center border border-white/5">
            <div className="text-3xl font-bold text-white">{value}</div>
            <div className="text-white/40 text-xs mt-1 font-mono tracking-wider">{label}</div>
          </div>
        ))}
      </motion.div>

      {data.topRepo && (
        <motion.div variants={item} className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <p className="text-white/40 text-xs font-mono tracking-wider mb-2">TOP REPO</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{data.topRepo.name}</p>
              {data.topRepo.language && (
                <p className="text-white/40 text-sm">{data.topRepo.language}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-white font-bold">{data.topRepo.stars}</span>
            </div>
          </div>
        </motion.div>
      )}

      {data.badges.length > 0 && (
        <motion.div variants={item}>
          <p className="text-white/40 text-xs font-mono tracking-wider mb-2">YOUR BADGES</p>
          <div className="flex flex-wrap gap-2">
            {data.badges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full text-xs font-semibold border border-[#1DB954]/30 text-[#1DB954] bg-[#1DB954]/10"
              >
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="text-white/20 text-xs font-mono text-center">
        Peak coding time: {formatHour(data.peakHour)}
      </motion.div>
    </motion.div>
  )
}
