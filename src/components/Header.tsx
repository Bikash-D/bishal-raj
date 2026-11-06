import { useEffect, useRef, useState } from 'react'
import { NAV, SITE } from '../content/site'
import { MobileMenu } from './MobileMenu'
import styles from './Header.module.css'

interface HeaderProps {
  activeId: string
}

export function Header({ activeId }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const frame = { pending: false }
    const update = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const p = docHeight > 0 ? Math.min(Math.max(scrollY / docHeight, 0), 1) : 0

      setScrolled(scrollY > 20)
      setPastHero(scrollY > window.innerHeight * 0.65)
      // Written straight to the element: no React re-render on every scroll frame.
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
      frame.pending = false
    }

    const onScroll = () => {
      if (!frame.pending) {
        window.requestAnimationFrame(update)
        frame.pending = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    // After the commit: until the dialog unmounts, the page behind it is still inert and cannot take focus.
    requestAnimationFrame(() => toggleRef.current?.focus({ preventScroll: true }))
  }

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.solid : ''}`}>
        <div
          ref={progressRef}
          className={styles.progressBar}
          aria-hidden="true"
        />

        <a
          href="#home"
          className={`${styles.brand} ${pastHero ? styles.brandShown : ''}`}
          tabIndex={pastHero ? 0 : -1}
          aria-label={`${SITE.name}, back to top`}
        >
          {SITE.nameUpper}
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} aria-current={activeId === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className={styles.toggle}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className={styles.toggleLines} aria-hidden="true" />
          Menu
        </button>
      </header>

      {menuOpen ? <MobileMenu activeId={activeId} onClose={closeMenu} /> : null}
    </>
  )
}
