import { createContext, useContext } from 'react'

export const FeatureNoticeContext = createContext(null)

export function useFeatureNotice() {
  const context = useContext(FeatureNoticeContext)
  if (!context) throw new Error('useFeatureNotice must be used within FeatureNoticeProvider')
  return context
}
