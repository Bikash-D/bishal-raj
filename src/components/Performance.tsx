import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { PERFORMANCE } from '../content/site'
import { PERFORMANCES, formatDuration, spokenDuration, type PerformancePiece } from '../content/performances'
import { PlayMark } from './Icons'
import { Reveal } from './Reveal'
import styles from './Performance.module.css'

interface PieceProps {
  piece: PerformancePiece
  /** The piece that most recently started playing, so only one plays at a time. */
  activeId: string | null
  onActivate: (id: string) => void
}

/**
 * Cinematic video presentation.
 * The <video> uses preload="none", so no video media is requested until the visitor presses play.
 * The poster image itself is attached only when the figure nears the viewport, so it never competes
 * with the hero photograph (the LCP element) during load.
 * Native playback controls (scrubber, volume, fullscreen) appear immediately on play.
 * Starting one performance automatically pauses the other.
 */
function PerformanceFigure({ piece, activeId, onActivate }: PieceProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [failed, setFailed] = useState(false)
  const [posterOn, setPosterOn] = useState(false)
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frameRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setPosterOn(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPosterOn(true)
          io.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Starting one piece pauses the other.
  useEffect(() => {
    if (activeId !== null && activeId !== piece.id) {
      videoRef.current?.pause()
    }
  }, [activeId, piece.id])

  const play = () => {
    const video = videoRef.current
    if (!video) return
    video.volume = piece.startVolume
    setStarted(true)
    onActivate(piece.id)
    void video.play().catch(() => {
      // Browser play refusal is safely handled; native controls remain accessible.
    })
    video.focus({ preventScroll: true })
  }

  const duration = formatDuration(piece.durationSeconds)
  const spoken = spokenDuration(piece.durationSeconds)
  const figureStyle = {
    '--native-w': `${piece.width}px`,
    '--ratio': piece.width / piece.height,
  } as CSSProperties

  return (
    <figure className={styles.figure} style={figureStyle}>
      <div ref={frameRef} className={styles.frame} style={{ aspectRatio: `${piece.width} / ${piece.height}` }}>
        {failed ? (
          <div className={styles.fallback} role="status">
            <p className={styles.fallbackTitle}>This footage could not be loaded.</p>
            <button
              type="button"
              className={styles.fallbackLink}
              onClick={() => {
                setFailed(false)
                setStarted(false)
              }}
            >
              Try again
            </button>
            <a href={piece.src} className={styles.fallbackLink} target="_blank" rel="noopener noreferrer">
              Open the video file
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </div>
        ) : (
          <video
            ref={videoRef}
            className={styles.video}
            src={piece.src}
            poster={posterOn ? piece.poster : undefined}
            width={piece.width}
            height={piece.height}
            controls={started}
            playsInline
            preload="none"
            aria-label={`${piece.label}, ${spoken}`}
            aria-describedby={`${piece.id}-desc`}
            onPlay={() => {
              setStarted(true)
              onActivate(piece.id)
            }}
            onError={() => setFailed(true)}
          >
            {piece.captions ? (
              <track
                kind="captions"
                src={piece.captions.src}
                srcLang={piece.captions.srclang}
                label={piece.captions.label}
              />
            ) : null}
          </video>
        )}

        {!started && !failed ? (
          <button
            type="button"
            className={styles.play}
            onClick={play}
          >
            <div className={styles.playCenter}>
              <span className={styles.playIcon} aria-hidden="true">
                <PlayMark size={24} />
              </span>
              <div className={styles.playLabel}>
                <span className={styles.playText}>Play Footage</span>
                <span className={styles.playTime} aria-hidden="true">
                  {duration}
                </span>
                <span className="visually-hidden">
                  {' '}
                  : {piece.label}, {spoken}
                </span>
              </div>
            </div>
          </button>
        ) : null}
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.number} aria-hidden="true">
          {piece.number}
        </span>
        <div className={styles.captionText}>
          <h3 className={styles.pieceTitle}>{piece.label}</h3>
          <p id={`${piece.id}-desc`} className="visually-hidden">
            {piece.posterAlt}
          </p>
          <p className={styles.meta}>
            <span>{duration}</span>
            {piece.note ? <span>{piece.note}</span> : null}
          </p>
          {piece.performerNote ? <p className={styles.meta}>{piece.performerNote}</p> : null}
        </div>
      </figcaption>
    </figure>
  )
}

const columns = PERFORMANCES.map((p) => `minmax(0, ${(p.width / p.height).toFixed(4)}fr)`).join(' ')

export function Performance() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <section id="performance" className={styles.performance} aria-labelledby="performance-heading">
      <div className={styles.head}>
        <Reveal>
          <p className={styles.label}>Performance</p>
          <h2 id="performance-heading" className={styles.heading}>
            {PERFORMANCE.heading}
          </h2>
          <p className={styles.body}>{PERFORMANCE.body}</p>
        </Reveal>
      </div>

      <div className={styles.pieces} style={{ '--cols': columns } as CSSProperties}>
        {PERFORMANCES.map((piece, i) => (
          <Reveal key={piece.id} className={styles.piece} delay={i * 120} variant="scale">
            <PerformanceFigure piece={piece} activeId={activeId} onActivate={setActiveId} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
