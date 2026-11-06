import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useModalBackdrop } from '../hooks/useModalBackdrop'
import type { ImageAsset } from '../content/media'
import { ChevronLeft, ChevronRight } from './Icons'
import styles from './Lightbox.module.css'

interface LightboxProps {
  items: readonly ImageAsset[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

const FOCUSABLE = 'button:not([disabled])'
const SWIPE_MIN = 44

/**
 * Full-screen photograph viewer.
 * Keyboard: Escape closes, Left/Right (and Home/End) navigate, Tab stays inside.
 * Touch: swipe horizontally.
 * Never enlarges beyond native pixel dimensions.
 */
export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)
  const count = items.length
  const asset = items[index]

  const go = useCallback(
    (delta: number) => onIndexChange((index + delta + count) % count),
    [index, count, onIndexChange],
  )

  useModalBackdrop()
  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault()
          onClose()
          break
        case 'ArrowLeft':
          event.preventDefault()
          go(-1)
          break
        case 'ArrowRight':
          event.preventDefault()
          go(1)
          break
        case 'Home':
          event.preventDefault()
          onIndexChange(0)
          break
        case 'End':
          event.preventDefault()
          onIndexChange(count - 1)
          break
        case 'Tab': {
          const root = rootRef.current
          if (!root) return
          const focusables = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
          const first = focusables[0]
          const last = focusables[focusables.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
          break
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [go, onClose, onIndexChange, count])

  // Warm browser cache for adjacent images
  useEffect(() => {
    for (const delta of [-1, 1]) {
      const img = new Image()
      img.src = items[(index + delta + count) % count].src
    }
  }, [index, items, count])

  return createPortal(
    <div
      ref={rootRef}
      className={styles.root}
      role="dialog"
      aria-modal="true"
      aria-label="Photograph viewer"
    >
      <div className={styles.bar}>
        <div className={styles.counterWrap}>
          <p className={styles.counter} aria-live="polite" aria-atomic="true">
            <span className={styles.current}>{String(index + 1).padStart(2, '0')}</span>
            <span className={styles.divider}> / </span>
            <span className={styles.total}>{String(count).padStart(2, '0')}</span>
            <span className="visually-hidden"> photographs</span>
          </p>
          <span className={styles.kbdHint} aria-hidden="true">
            ← → to navigate · Esc to close
          </span>
        </div>

        <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label="Close viewer">
          Close
        </button>
      </div>

      <div
        className={styles.stage}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        onPointerDown={(e) => {
          if (e.pointerType === 'mouse') return
          swipe.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerUp={(e) => {
          const start = swipe.current
          swipe.current = null
          if (!start || count < 2) return
          const dx = e.clientX - start.x
          const dy = e.clientY - start.y
          if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy) * 1.5) {
            go(dx < 0 ? 1 : -1)
          }
        }}
        onPointerCancel={() => {
          swipe.current = null
        }}
      >
        <div className={styles.imageHolder}>
          <img
            key={asset.id}
            className={styles.image}
            src={asset.src}
            width={asset.width}
            height={asset.height}
            alt={asset.alt}
            draggable={false}
          />
        </div>
      </div>

      {count > 1 ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={`${styles.nav} ${styles.prev}`}
            onClick={() => go(-1)}
            aria-label="Previous photograph"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className={`${styles.nav} ${styles.next}`}
            onClick={() => go(1)}
            aria-label="Next photograph"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
