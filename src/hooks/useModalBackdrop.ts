import { useEffect } from 'react'

/**
 * While a modal dialog is open: lock page scroll and make the rest of the app inert, so keyboard,
 * mouse AND touch screen readers (VoiceOver/TalkBack swipe) cannot wander into the page behind it.
 * The dialog itself must be rendered outside #root (see createPortal usage), otherwise it would be
 * made inert too. Restores everything on close.
 */
export function useModalBackdrop(): void {
  useEffect(() => {
    const root = document.getElementById('root')
    const html = document.documentElement
    const previousOverflow = html.style.overflow
    const wasInert = root?.inert ?? false
    html.style.overflow = 'hidden'
    if (root) root.inert = true
    return () => {
      html.style.overflow = previousOverflow
      if (root) root.inert = wasInert
    }
  }, [])
}
