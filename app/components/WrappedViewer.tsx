'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { WrappedData } from '../lib/github'
import OverviewSlide from './OverviewSlide'
import LanguagesSlide from './LanguagesSlide'
import StreakSlide from './StreakSlide'
import PeakHoursSlide from './PeakHoursSlide'
import ShareSlide from './ShareSlide'

const SLIDES = [
  { id: 'overview', label: 'Overview' },
  { id: 'languages', label: 'Languages' },
  { id: 'streak', label: 'Streak' },
  { id: 'hours', label: 'Hours' },
  { id: 'share', label: 'Share' },
]

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
}

export default function WrappedViewer({ data, onReset }: { data: WrappedData; onReset: () => void }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }

  const prev = () => current > 0 && go(current - 1)
  const next = () => current < SLIDES.length - 1 && go(current + 1)

  const renderSlide = () => {
    switch (current) {
      case 0: return <OverviewSlide data={data} />
      case 1: return <LanguagesSlide data={data} />
      case 2: return <StreakSlide data={data} />
      case 3: return <PeakHoursSlide data={data} />
      case 4: return <ShareSlide data={data} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-6 justify-center">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? 24 : 6,
                height: 6,
                background: i === current ? '#1DB954' : 'rgba(255,255,255,0.15)',
              }}
              aria-label={s.label}
            />
          ))}
        </div>

        {/* Card */}
        <div
          className="rounded-3xl border border-white/8 overflow-hidden"
          style={{ background: '#111118', minHeight: 460 }}
        >
          <div className="p-6 relative overflow-hidden" style={{ minHeight: 420 }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {renderSlide()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between px-6 pb-5 pt-2 border-t border-white/5">
            <button
              onClick={prev}
              disabled={current === 0}
              className="px-4 py-2 rounded-xl text-sm font-mono text-white/40 hover:text-white/80 disabled:opacity-0 transition-all"
            >
              ← prev
            </button>

            <span className="text-white/20 text-xs font-mono">
              {current + 1} / {SLIDES.length}
            </span>

            <button
              onClick={next}
              disabled={current === SLIDES.length - 1}
              className="px-4 py-2 rounded-xl text-sm font-mono text-white/40 hover:text-white/80 disabled:opacity-0 transition-all"
            >
              next →
            </button>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-4 w-full text-center text-white/20 text-xs font-mono hover:text-white/50 transition-colors py-2"
        >
          ↩ try another username
        </button>
      </div>
    </div>
  )
}
