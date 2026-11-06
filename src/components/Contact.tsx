import { useRef, useState } from 'react'
import { CONTACT, CONTACT_CONFIG, SITE, SOCIAL_LINKS } from '../content/site'
import { PRESS_KIT } from '../content/press-kit'
import { ArrowUpRight, CheckIcon, CopyIcon, MailIcon, WhatsAppIcon } from './Icons'
import { Reveal } from './Reveal'
import styles from './Contact.module.css'

const YEAR = new Date().getFullYear()

type CopyKey = 'email' | 'phone'

/** Modern clipboard API first; select-and-copy fallback for older/insecure contexts. */
async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}

export function Contact() {
  const [copied, setCopied] = useState<CopyKey | null>(null)
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  const copy = async (text: string, key: CopyKey, spoken: string) => {
    const ok = await writeClipboard(text)
    window.clearTimeout(timer.current)
    if (ok) {
      setCopied(key)
      setMessage(`${spoken} copied to clipboard.`)
    } else {
      setCopied(null)
      setMessage(`Could not copy automatically. Please select and copy: ${text}`)
    }
    timer.current = window.setTimeout(() => {
      setCopied(null)
      setMessage('')
    }, 3000)
  }

  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
      <div className={styles.header}>
        <Reveal>
          <p className={styles.label}>Contact</p>
          <h2 id="contact-heading" className={styles.heading}>
            {CONTACT.heading}
          </h2>
          <p className={styles.lead}>{CONTACT.body}</p>
          <p className={styles.invitation}>{CONTACT.invitation}</p>
        </Reveal>
      </div>

      <div className={styles.content}>
        <div className={styles.primaryChannels}>
          <Reveal delay={100} variant="scale" className={styles.cardReveal}>
            <div className={`${styles.card} ${styles.emailCard}`}>
              <div className={styles.cardInfo}>
                <span className={styles.cardBadge}>
                  <MailIcon size={16} />
                  <span>Email</span>
                </span>
                <a href={CONTACT_CONFIG.emailHref} className={styles.cardValue}>
                  {CONTACT_CONFIG.email}
                </a>
                <p className={styles.cardSub}>Opens your email app with a prepared subject line.</p>
              </div>
              <div className={styles.cardActions}>
                <a href={CONTACT_CONFIG.emailHref} className={styles.cardAction}>
                  <span>Send email</span>
                  <ArrowUpRight size={16} />
                </a>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => copy(CONTACT_CONFIG.email, 'email', 'Email address')}
                >
                  {copied === 'email' ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  <span>{copied === 'email' ? 'Copied' : 'Copy'}</span>
                  <span className="visually-hidden"> email address</span>
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={180} variant="scale" className={styles.cardReveal}>
            <div className={`${styles.card} ${styles.whatsappCard}`}>
              <div className={styles.cardInfo}>
                <span className={`${styles.cardBadge} ${styles.whatsappBadge}`}>
                  <WhatsAppIcon size={16} />
                  <span>WhatsApp</span>
                </span>
                <a
                  href={CONTACT_CONFIG.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cardValue}
                >
                  {CONTACT_CONFIG.phoneDisplay}
                  <span className="visually-hidden"> (opens WhatsApp in a new tab)</span>
                </a>
                <p className={styles.cardSub}>Opens a chat with a prepared message.</p>
              </div>
              <div className={styles.cardActions}>
                <a
                  href={CONTACT_CONFIG.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.cardAction} ${styles.whatsappAction}`}
                >
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight size={16} />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
                <button
                  type="button"
                  className={styles.copyBtn}
                  onClick={() => copy(CONTACT_CONFIG.phoneDisplay, 'phone', 'Phone number')}
                >
                  {copied === 'phone' ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  <span>{copied === 'phone' ? 'Copied' : 'Copy'}</span>
                  <span className="visually-hidden"> phone number</span>
                </button>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={240} className={styles.secondarySection}>
          <div className={styles.socialHeader}>
            <h3 className={styles.socialTitle}>Profiles &amp; downloads</h3>
            <span className={styles.socialRule} aria-hidden="true" />
          </div>

          <ul className={styles.socialList}>
            {PRESS_KIT.file ? (
              <li>
                <a
                  href={PRESS_KIT.file.href}
                  download={PRESS_KIT.file.downloadName}
                  className={styles.socialRow}
                >
                  <span className={styles.socialLabel}>{PRESS_KIT.label}</span>
                  <span className={styles.socialHandle}>
                    Download {PRESS_KIT.file.format}
                    <span className={styles.socialMeta}> · {PRESS_KIT.file.pages} page</span>
                  </span>
                  <ArrowUpRight className={styles.socialArrow} size={18} />
                </a>
              </li>
            ) : null}
            {SOCIAL_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.url} className={styles.socialRow} target="_blank" rel="noopener noreferrer">
                  <span className={styles.socialLabel}>{link.label}</span>
                  <span className={styles.socialHandle}>{link.handle}</span>
                  <ArrowUpRight className={styles.socialArrow} size={18} />
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <p className="visually-hidden" role="status" aria-live="polite">
        {message}
      </p>

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          © {YEAR} {SITE.name} · All rights reserved
        </p>
        <a href="#home" className={styles.topLink}>
          Back to top ↑
        </a>
        {import.meta.env.DEV ? (
          <a href="#media-review" className={styles.devLink}>
            Media review (development only)
          </a>
        ) : null}
      </footer>
    </section>
  )
}
