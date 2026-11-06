import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import styles from './Reveal.module.css'

export type RevealVariant = 'rise' | 'fade' | 'scale' | 'zoom-in'

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in milliseconds. Keep subtle so visitors never feel delayed. */
  delay?: number
  /** Visual motion variant. Default is 'rise'. */
  variant?: RevealVariant
  style?: CSSProperties
}

/**
 * Cinematic reveal component.
 * Uses IntersectionObserver to trigger smooth, elegant appearance once in view.
 * Fully honours prefers-reduced-motion (collapses immediately).
 */
export function Reveal({ children, className, delay = 0, variant = 'rise', style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || !('IntersectionObserver' in window)) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const variantClass = styles[variant] ?? styles.rise
  const classes = [styles.reveal, variantClass, shown ? styles.shown : '', className ?? ''].filter(Boolean).join(' ')

  const inlineStyle: CSSProperties = {
    ...style,
    ...(delay ? { transitionDelay: `${delay}ms` } : {}),
  }

  return (
    <div ref={ref} className={classes} style={inlineStyle}>
      {children}
    </div>
  )
}
