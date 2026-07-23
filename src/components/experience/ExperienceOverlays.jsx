import { motion } from 'framer-motion'

const PARTICLES = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 17) % 92)}%`,
  delay: (index % 7) * 0.09,
  color: ['#FF806F', '#FFD064', '#BCAEFF', '#FFFFFF'][index % 4],
  rotate: (index * 53) % 180,
}))

function ParticleField({ distance = 760 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {PARTICLES.map((particle) => (
        <motion.i
          key={particle.id}
          className="absolute -top-8 h-4 w-2 rounded-full"
          style={{ left: particle.left, background: particle.color, rotate: particle.rotate }}
          initial={{ y: -40, opacity: 0, scale: 0.7 }}
          animate={{ y: distance, x: [0, particle.id % 2 ? 28 : -24, 8], opacity: [0, 1, 1, 0], rotate: particle.rotate + 540 }}
          transition={{ duration: 2.4 + (particle.id % 4) * 0.25, delay: particle.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

function DeliveryBag({ className = 'h-28 w-28' }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" aria-hidden="true">
      <path d="M26 42h68l-6 60H32l-6-60Z" fill="white" />
      <path d="M43 45V31c0-10 7-17 17-17s17 7 17 17v14" stroke="#FFD064" strokeWidth="8" strokeLinecap="round" />
      <path d="M48 67h25M48 80h17" stroke="#6D4AFF" strokeWidth="7" strokeLinecap="round" />
      <circle cx="84" cy="73" r="13" fill="#FF806F" />
      <path d="m78 73 4 4 8-9" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function OrderLaunchOverlay({ restaurantName }) {
  return (
    <motion.section
      className="fixed inset-0 z-[110] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[var(--brand-night)] px-7 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="assertive"
    >
      <motion.div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(109,74,255,.62),transparent_48%)]" animate={{ scale: [0.8, 1.2, 0.9], opacity: [0.5, 1, 0.65] }} transition={{ duration: 1.8 }} />
      {[0, 1, 2].map((ring) => <motion.i key={ring} className="absolute h-52 w-52 rounded-full border border-white/15" initial={{ scale: 0.25, opacity: 0.8 }} animate={{ scale: 2.5 + ring * 0.4, opacity: 0 }} transition={{ duration: 1.7, delay: ring * 0.2, repeat: Infinity }} />)}
      <motion.div
        className="relative"
        initial={{ y: 70, rotate: -10, scale: 0.7 }}
        animate={{ y: [70, 0, -8, -2], rotate: [-10, 4, -2, 0], scale: [0.7, 1.08, 1] }}
        transition={{ duration: 1.25, ease: 'easeOut' }}
      >
        <DeliveryBag />
      </motion.div>
      <motion.p className="relative mt-8 text-[10px] font-black uppercase tracking-[0.34em] text-[#ffd4cc]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>ORDER IS TAKING OFF</motion.p>
      <motion.h2 className="relative mt-3 text-[34px] font-black leading-tight" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}>这一单，出发啦</motion.h2>
      <motion.p className="relative mt-3 text-sm text-white/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>正在把期待送去 {restaurantName}</motion.p>
      <div className="relative mt-8 flex items-center gap-2">
        {[0, 1, 2].map((dot) => <motion.i key={dot} className="h-2 w-2 rounded-full bg-white" animate={{ y: [0, -8, 0], opacity: [0.35, 1, 0.35] }} transition={{ duration: 0.8, delay: dot * 0.14, repeat: Infinity }} />)}
      </div>
    </motion.section>
  )
}

export function TaskCelebrationOverlay({ taskName, focusLabel, onDismiss }) {
  return (
    <motion.section
      className="fixed inset-0 z-[110] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#171329] via-[#4a2fb2] to-[#ff6959] px-7 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-live="assertive"
    >
      <ParticleField />
      <motion.div className="absolute h-[420px] w-[420px] rounded-full border-[44px] border-white/5" initial={{ scale: 0.2, rotate: -45 }} animate={{ scale: 1.3, rotate: 35 }} transition={{ duration: 1.4, ease: 'easeOut' }} />
      <motion.p className="relative text-[11px] font-black tracking-[0.4em] text-[#ffe2a8]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>WAITING ACHIEVEMENT</motion.p>
      <motion.h2
        className="relative mt-5 text-[72px] font-black leading-[0.86] tracking-[-0.08em] drop-shadow-[0_18px_30px_rgba(20,10,40,.3)]"
        initial={{ scale: 0.2, rotate: -12, opacity: 0 }}
        animate={{ scale: [0.2, 1.22, 0.96, 1], rotate: [-12, 5, -2, 0], opacity: 1 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        完成!
      </motion.h2>
      <motion.div className="relative mt-8 max-w-[310px] rounded-[28px] border border-white/15 bg-white/10 px-6 py-5 backdrop-blur" initial={{ y: 35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.55 }}>
        <p className="text-lg font-black">{taskName}</p>
        <p className="mt-2 text-sm text-white/65">{focusLabel} 的认真，已经被今晚收下。</p>
      </motion.div>
      <motion.button onClick={onDismiss} className="relative mt-7 rounded-full bg-white px-7 py-3 text-sm font-black text-[#3c287f] shadow-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>收下这份成就</motion.button>
    </motion.section>
  )
}

export function DeliveryArrivalOverlay({ restaurantName, onDismiss }) {
  return (
    <motion.section
      className="fixed inset-0 z-[110] flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[var(--brand-night)] px-6 text-center text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      aria-live="assertive"
    >
      <ParticleField distance={900} />
      <motion.div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(109,74,255,.05),rgba(255,107,87,.42),rgba(255,208,100,.04),rgba(109,74,255,.5),rgba(109,74,255,.05))]" animate={{ rotate: 360, scale: [1, 1.3, 1] }} transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2.4, repeat: Infinity } }} />
      {[0, 1, 2, 3].map((ring) => <motion.i key={ring} className="absolute h-40 w-40 rounded-full border-2 border-white/20" initial={{ scale: 0.2, opacity: 0.9 }} animate={{ scale: 3.8 + ring * 0.5, opacity: 0 }} transition={{ duration: 2.2, delay: ring * 0.22, repeat: Infinity }} />)}
      <motion.div className="relative" initial={{ y: -180, scale: 0.4, rotate: 14 }} animate={{ y: [140, -20, 12, 0], scale: [0.4, 1.25, 0.92, 1], rotate: [14, -7, 3, 0] }} transition={{ duration: 1.05, ease: 'easeOut' }}><DeliveryBag className="h-32 w-32" /></motion.div>
      <motion.p className="relative mt-5 text-[10px] font-black tracking-[0.38em] text-[#ffd7cf]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>IMAGINATION DELIVERED</motion.p>
      <motion.h2 className="relative mt-3 bg-gradient-to-b from-white via-white to-[#c9baff] bg-clip-text text-[94px] font-black leading-[0.86] tracking-[-0.09em] text-transparent drop-shadow-[0_20px_35px_rgba(109,74,255,.45)]" initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: [0.2, 1.24, 0.96, 1], opacity: 1 }} transition={{ delay: 0.35, duration: 0.9 }}>到了!</motion.h2>
      <motion.p className="relative mt-7 text-lg font-black" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.85 }}>{restaurantName} 把期待送到了</motion.p>
      <motion.p className="relative mt-2 text-sm text-white/55" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>没有扣款，快乐照常签收。</motion.p>
      <motion.button onClick={onDismiss} className="relative mt-8 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>拆开今晚的惊喜</motion.button>
    </motion.section>
  )
}
