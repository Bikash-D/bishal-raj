import { ABOUT, TRAINING } from '../content/site'
import { visibleCredits, visibleFacts } from '../content/profile'
import { images } from '../content/media'
import { Picture } from './Picture'
import { Reveal } from './Reveal'
import styles from './About.module.css'

export function About() {
  const facts = visibleFacts()
  const credits = visibleCredits()
  return (
    <section id="about" className={styles.about} aria-labelledby="about-heading">
      <Reveal className={styles.photo} variant="scale">
        <div className={styles.photoFrame}>
          <Picture asset={images.portraitIntense} sizes="(min-width: 900px) 58vw, 100vw" style={{ width: '100%' }} />
        </div>
      </Reveal>

      <div className={styles.text}>
        <Reveal>
          <p className={styles.label}>About</p>
          <h2 id="about-heading" className={styles.lead}>
            {ABOUT.lead}
          </h2>
        </Reveal>

        <Reveal delay={120} className={styles.body}>
          {ABOUT.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </Reveal>

        <Reveal delay={160}>
          <div className={styles.training}>
            <p className={styles.trainingLabel}>{TRAINING.label}</p>
            <p className={styles.trainingName}>{TRAINING.institution}</p>
            <div className={styles.statusWrap}>
              <span className={styles.certificateBadge}>{TRAINING.status}</span>
            </div>
            {TRAINING.courseTitle || TRAINING.certificateTitle || TRAINING.year ? (
              <p className={styles.trainingDetail}>
                {[TRAINING.courseTitle, TRAINING.certificateTitle, TRAINING.year].filter(Boolean).join(' \u00b7 ')}
              </p>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={200}>
          <dl className={styles.facts}>
            {facts.map((f) => (
              <div key={f.id}>
                <dt>{f.label}</dt>
                {Array.isArray(f.value) ? (
                  <dd className={styles.openToChips}>
                    {f.value.map((item) => (
                      <span key={item} className={styles.chip}>
                        {item}
                      </span>
                    ))}
                  </dd>
                ) : (
                  <dd>
                    <span className={styles.factHighlight}>{String(f.value)}</span>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </Reveal>

        {credits.length > 0 ? (
          <Reveal delay={240}>
            <div className={styles.credits}>
              <h3 className={styles.creditsTitle}>Credits</h3>
              <ul>
                {credits.map((c) => (
                  <li key={`${c.title}-${c.year ?? ''}`}>
                    <span className={styles.creditTitle}>{c.title}</span>
                    <span className={styles.creditMeta}>
                      {[c.role, c.kind, c.company, c.year].filter(Boolean).join(' \u00b7 ')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}
