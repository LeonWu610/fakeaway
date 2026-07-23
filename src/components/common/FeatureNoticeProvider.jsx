import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FeatureNoticeContext } from '../../contexts/FeatureNoticeContext'

const DEFAULT_NOTICE = {
  eyebrow: '街区施工中',
  title: '这扇小门还没装好',
  message: '我们正在里面忙活。先去别处逛一圈，下次路过时也许就亮灯了。',
}

function ConstructionIcon() {
  return (
    <svg viewBox="0 0 80 80" className="h-20 w-20" fill="none" aria-hidden="true">
      <motion.path
        d="M14 52 32 18l18 34H14Z"
        fill="#FF806F"
        initial={{ rotate: -8, y: 8 }}
        animate={{ rotate: [0, -3, 0], y: [0, -2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      />
      <path d="m31 28 4 8h-8l4-8Zm-8 16h17" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <path d="M10 58h52" stroke="#6D4AFF" strokeWidth="7" strokeLinecap="round" />
      <motion.path
        d="M54 14v13m-6-6h12M65 34v8m-4-4h8"
        stroke="#FFD064"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [0.35, 1, 0.35], scale: [0.85, 1.12, 0.85] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  )
}

export default function FeatureNoticeProvider({ children }) {
  const [notice, setNotice] = useState(null)
  const showFeatureNotice = useCallback((nextNotice = {}) => {
    setNotice({ ...DEFAULT_NOTICE, ...nextNotice })
  }, [])
  const closeFeatureNotice = useCallback(() => setNotice(null), [])
  const value = useMemo(() => ({ showFeatureNotice }), [showFeatureNotice])

  return (
    <FeatureNoticeContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {notice && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-end justify-center bg-[#181426]/65 px-3 pb-[max(14px,env(safe-area-inset-bottom))] backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="presentation"
          >
            <button className="absolute inset-0" onClick={closeFeatureNotice} aria-label="关闭功能提示" />
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="feature-notice-title"
              className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] bg-white px-6 pb-6 pt-5 text-center shadow-[0_28px_80px_rgba(15,10,32,.38)]"
              initial={{ y: 70, scale: 0.92, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 40, scale: 0.96, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            >
              <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[var(--brand-primary-soft)]" />
              <div className="absolute -left-8 bottom-12 h-24 w-24 rounded-full bg-[var(--brand-coral-soft)]" />
              <button onClick={closeFeatureNotice} aria-label="关闭" className="absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-lg text-gray-500">×</button>
              <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-[32px] bg-gradient-to-br from-[var(--brand-primary-soft)] to-[var(--brand-coral-soft)]">
                <ConstructionIcon />
              </div>
              <p className="relative mt-4 text-[10px] font-black uppercase tracking-[0.22em] text-[var(--brand-coral)]">{notice.eyebrow}</p>
              <h2 id="feature-notice-title" className="relative mt-2 text-[22px] font-black text-[var(--text-primary)]">{notice.title}</h2>
              <p className="relative mx-auto mt-2 max-w-[310px] text-[13px] leading-6 text-[var(--text-muted)]">{notice.message}</p>
              <button onClick={closeFeatureNotice} className="relative mt-5 h-11 w-full rounded-full bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-coral)] text-[14px] font-black text-white shadow-[0_10px_28px_rgba(109,74,255,.25)] active:scale-[0.98]">知道啦，继续逛逛</button>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </FeatureNoticeContext.Provider>
  )
}
