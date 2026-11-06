import { HERO_ACTIONS, HERO_FACTS, HERO_INTRO, SITE } from '../content/site'
import { images } from '../content/media'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { Picture } from './Picture'
import styles from './Hero.module.css'

/**
 * The first screen. A casting director should learn, without scrolling: who he is, that he is an
 * actor, his confirmed training, his performing language, and have both key actions in reach.
 * Two art-directed frames from the same session:
 *  - 900px and wider: kneelWide (p5) at the right, name and copy at the left.
 *  - narrower: kneelClose (p4). The empty headroom carries the name; the two actions sit directly
 *    under the photograph so they are visible on the first screen of every phone.
 */
export function Hero() {
  const wide = useMediaQuery('(min-width: 900px)')
  const asset = wide ? images.kneelWide : images.kneelClose
  const sizes = wide ? '(min-width: 1600px) 884px, 62vw' : '100vw'

  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.figure} key={asset.id}>
        <div className={styles.photoWrap}>
          <Picture asset={asset} sizes={sizes} priority style={{ width: '100%' }} />
        </div>
      </div>

      <div className={styles.copy}>
        <div className={styles.title}>
          <h1 id="hero-name" className={styles.name}>
            <span>Bishal</span> <span>Raj</span>
          </h1>
          <p className={styles.role}>{SITE.role}</p>
          <ul className={styles.facts} aria-label="Training and language">
            {HERO_FACTS.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        </div>

        <div className={styles.intro}>
          <p className={styles.lead}>{HERO_INTRO}</p>

          <div className={styles.actions}>
            <a href="#performance" className={styles.primaryAction}>
              <span>{HERO_ACTIONS.watch}</span>
            </a>
            <a href="#contact" className={styles.secondaryAction}>
              <span>{HERO_ACTIONS.contact}</span>
            </a>
          </div>

          <a href="#about" className={styles.cue}>
            <span className={styles.cueLine} aria-hidden="true" />
            <span className={styles.cueText}>Explore</span>
            <span className="visually-hidden"> the about section</span>
          </a>
        </div>
      </div>
    </section>
  )
}
