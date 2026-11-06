import { useEffect, useState } from 'react'
import { CONTACT_CONFIG } from '../content/site'
import { ArrowUp, WhatsAppIcon } from './Icons'
import styles from './FloatingActions.module.css'

export function FloatingActions() {
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [contactInView, setContactInView] = useState(false)

  // In the Contact section the WhatsApp card is already on screen, so the floating copy steps aside.
  useEffect(() => {
    const el = document.getElementById('contact')
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setContactInView(entry.isIntersecting), {
      rootMargin: '0px 0px -25% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const heroThreshold = window.innerHeight * 0.6
          const topThreshold = window.innerHeight * 1.2

          setShowWhatsApp(scrollY > heroThreshold)
          setShowBackToTop(scrollY > topThreshold)
          ticking = false
        })
        ticking = true
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  const whatsAppVisible = showWhatsApp && !contactInView
  if (!whatsAppVisible && !showBackToTop) return null

  return (
    <aside className={styles.cluster} aria-label="Quick actions">
      {showBackToTop ? (
        <button
          type="button"
          onClick={scrollToTop}
          className={`${styles.button} ${styles.topButton}`}
          aria-label="Scroll back to top"
        >
          <ArrowUp size={18} />
          <span className={styles.tooltip}>Top</span>
        </button>
      ) : null}

      {whatsAppVisible ? (
        <a
          href={CONTACT_CONFIG.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.button} ${styles.whatsappButton}`}
        >
          <WhatsAppIcon size={20} />
          <span className={styles.tooltip}>WhatsApp Bishal</span>
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      ) : null}
    </aside>
  )
}

