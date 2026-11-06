import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useModalBackdrop } from '../hooks/useModalBackdrop'
import { CONTACT_CONFIG, NAV, SITE, SOCIAL_LINKS } from '../content/site'
import { MailIcon, WhatsAppIcon } from './Icons'
import styles from './MobileMenu.module.css'

interface MobileMenuProps {
  activeId: string
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Full-screen mobile navigation.
 * Traps keyboard focus, closes on Escape or backdrop/link click, locks body scroll while active.
 * Restores focus to toggle button on exit.
 */
export function MobileMenu({ activeId, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  useModalBackdrop()

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const mql = window.matchMedia('(min-width: 800px)')
    const onWide = () => mql.matches && onClose()

    document.addEventListener('keydown', onKey)
    mql.addEventListener('change', onWide)
    return () => {
      document.removeEventListener('keydown', onKey)
      mql.removeEventListener('change', onWide)
    }
  }, [onClose])

  return createPortal(
    <div ref={panelRef} className={styles.panel} role="dialog" aria-modal="true" aria-label="Menu">
      <div className={styles.top}>
        <span className={styles.brand}>{SITE.nameUpper}</span>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close menu">
          Close
        </button>
      </div>

      <nav aria-label="Primary" className={styles.nav}>
        <ul>
          {NAV.map((item, i) => (
            <li key={item.id} style={{ animationDelay: `${50 + i * 40}ms` }}>
              <a
                href={`#${item.id}`}
                onClick={onClose}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.bottomSection}>
        <div className={styles.quickContact}>
          <a
            href={CONTACT_CONFIG.emailHref}
            className={styles.contactAction}
          >
            <MailIcon size={16} />
            <span className={styles.contactActionText}>{CONTACT_CONFIG.email}</span>
          </a>
          <a
            href={CONTACT_CONFIG.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactAction}
          >
            <WhatsAppIcon size={16} />
            <span className={styles.contactActionText}>WhatsApp: {CONTACT_CONFIG.phoneDisplay}</span>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <ul className={styles.social}>
          {SOCIAL_LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                {link.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>,
    document.body,
  )
}
