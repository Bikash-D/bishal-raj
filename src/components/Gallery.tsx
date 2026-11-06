import { useRef, useState } from 'react'
import { GALLERY, galleryAsset } from '../content/gallery'
import { Lightbox } from './Lightbox'
import { Picture } from './Picture'
import { Reveal } from './Reveal'
import styles from './Gallery.module.css'

export function Gallery() {
  const entries = GALLERY
  const assets = entries.map(galleryAsset)
  const rows = [1, 2] as const

  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = (index: number, trigger: HTMLElement) => {
    triggerRef.current = trigger
    setOpenIndex(index)
  }

  const close = () => {
    setOpenIndex(null)
    // Return focus gracefully to the plate that opened the lightbox.
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }))
  }

  return (
    <section id="gallery" className={styles.gallery} aria-labelledby="gallery-heading">
      <Reveal className={styles.head}>
        <p className={styles.label}>Gallery</p>
        <h2 id="gallery-heading" className={styles.heading}>
          On stage
        </h2>
        <p className={styles.note}>Selected production and stage photographs. Select any plate to inspect in detail.</p>
      </Reveal>

      <div className={styles.grid}>
        {rows.map((row) => (
          <div key={row} className={`${styles.row} ${row === 1 ? styles.lead : ''}`}>
            {entries.map((entry, i) => {
              if (entry.row !== row) return null
              const asset = assets[i]
              const ratio = asset.width / asset.height
              return (
                <Reveal
                  key={entry.id}
                  className={`${styles.plate} ${ratio < 1 ? styles.portrait : ''}`}
                  delay={i * 70}
                  variant="scale"
                  style={{ '--ratio': ratio.toFixed(4) } as React.CSSProperties}
                >
                  <button
                    type="button"
                    className={styles.button}
                    onClick={(e) => open(i, e.currentTarget)}
                    aria-label={`View photograph ${i + 1} of ${entries.length}. ${asset.alt}`}
                  >
                    <div className={styles.imageWrap}>
                      <Picture asset={asset} sizes={entry.sizes} style={{ width: '100%' }} />
                      <div className={styles.overlay} aria-hidden="true" />
                    </div>
                    <div className={styles.plateMeta} aria-hidden="true">
                      {/* Decorative: drawn by CSS (content: attr) so it is not extra text for screen readers */}
                      <span className={styles.index} data-n={String(i + 1).padStart(2, '0')} />
                      <span className={styles.viewPrompt} />
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        ))}
      </div>

      {openIndex !== null ? (
        <Lightbox items={assets} index={openIndex} onIndexChange={setOpenIndex} onClose={close} />
      ) : null}
    </section>
  )
}
