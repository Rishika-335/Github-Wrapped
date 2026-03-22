'use client'
import { motion } from 'framer-motion'
import type { WrappedData } from '../lib/github'

export default function LanguagesSlide({ data }: { data: WrappedData }) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={item}>
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">Your languages</p>
        <h2 className="text-3xl font-bold text-white">What you shipped in</h2>
      </motion.div>

      <motion.div variants={item} className="flex gap-1 h-6 rounded-full overflow-hidden">
        {data.languages.map((lang) => (
          <motion.div
            key={lang.name}
            initial={{ flex: 0 }}
            animate={{ flex: lang.percentage }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            style={{ background: lang.color }}
            title={`${lang.name}: ${lang.percentage}%`}
          />
        ))}
      </motion.div>

      <div className="flex flex-col gap-3">
        {data.languages.map((lang, i) => (
          <motion.div key={lang.name} variants={item} className="flex items-center gap-3">
            <span className="text-white/30 font-mono text-sm w-4">{i + 1}</span>
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ background: lang.color }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-white font-semibold">{lang.name}</span>
                <span className="text-white/50 text-sm font-mono">{lang.percentage}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: lang.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${lang.percentage}%` }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 + i * 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {data.languages.length === 0 && (
        <div className="text-white/30 text-center py-8">
          No language data found — try a user with public repos
        </div>
      )}
    </motion.div>
  )
}
