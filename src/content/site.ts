/**
 * Site content. Everything here is supplied by Bishal's team. Nothing is invented: no credits,
 * awards, representation or testimonials. Training is limited to what has been confirmed
 * (Mandala Theatre, certificate holder); see TRAINING below to add exact certificate wording.
 *
 * This file must stay free of `import.meta.env` and bundler-only imports: scripts/build-profile-pdf.mjs
 * imports it directly with Node, so the downloadable profile sheet always matches the website.
 */

/**
 * Public contact details confirmed by the owner for professional enquiries.
 * All contact information is centralized here so it is never hardcoded across components.
 */
export const CONTACT_CONFIG = {
  email: 'thebishalraj@gmail.com',
  emailSubject: 'Professional Enquiry — Bishal Raj',
  emailHref: `mailto:thebishalraj@gmail.com?subject=${encodeURIComponent('Professional Enquiry — Bishal Raj')}`,
  phoneDisplay: '+977 986-4838906',
  whatsappNumber: '9779864838906',
  whatsappMessage: 'Hello Bishal, I visited your portfolio and would like to discuss a professional opportunity.',
  whatsappHref: `https://wa.me/9779864838906?text=${encodeURIComponent(
    'Hello Bishal, I visited your portfolio and would like to discuss a professional opportunity.',
  )}`,
  instagram: {
    label: 'Instagram',
    handle: '@biishal.rajjj',
    url: 'https://www.instagram.com/biishal.rajjj/',
  },
  facebook: {
    label: 'Facebook',
    handle: 'bishalrajjj',
    url: 'https://www.facebook.com/bishalrajjj',
  },
} as const

export const SITE = {
  name: 'Bishal Raj',
  /** English professional name only. The Devanagari spelling has not been confirmed. */
  nameUpper: 'BISHAL RAJ',
  role: 'Actor',
  primaryLanguage: 'Nepali',
  intro: 'Bishal Raj is an actor trained in theatre at Mandala Theatre, performing primarily in Nepali.',
  openTo: ['Film', 'Television', 'Theatre', 'Commercials', 'Digital productions'],
} as const

/** Hero line. Wording supplied by Bishal's team; no biographical detail is added. */
export const HERO_INTRO =
  'An emerging Nepali actor exploring character, emotion and the human experience through performance.'

/**
 * Confirmed by the owner: training at Mandala Theatre, and he holds a certificate.
 * NOT confirmed (so left null and never shown): the official course title, certificate title,
 * level, duration, year, accreditation. Fill these in when supplied; they appear in the About
 * section automatically.
 */
export const TRAINING = {
  label: 'Theatre Training',
  institution: 'Mandala Theatre',
  status: 'Certificate holder',
  courseTitle: null as string | null,
  certificateTitle: null as string | null,
  year: null as string | null,
} as const

/**
 * The two confirmed facts shown under the name on the first screen, so a casting director sees
 * training and performing language without scrolling. Both were confirmed by the owner.
 */
export const HERO_FACTS: readonly string[] = [`${TRAINING.institution} certificate`, `Performs in ${SITE.primaryLanguage}`]

export const ABOUT = {
  lead: 'Grounded in theatre. Open to the screen.',
  paragraphs: [
    'Bishal Raj is an emerging Nepali actor. He trained in theatre at Mandala Theatre and holds a certificate from the institution. He performs primarily in Nepali.',
    'He is early in his career and open to work across film, television, theatre, commercials and digital productions. The photographs and performances on this page are a first look at his presence on stage.',
  ],
} as const

export const HERO_ACTIONS = {
  watch: 'View performances',
  contact: 'Contact Bishal',
} as const

export const PERFORMANCE = {
  heading: 'Selected performances',
  body: 'Two pieces of footage. Nothing plays until you press play.',
} as const

export const CONTACT = {
  heading: 'Working together',
  body: 'Casting directors, filmmakers, theatre directors and collaborators are welcome to get in touch for projects, auditions and creative collaborations.',
  invitation: 'Direct professional enquiries are welcomed via email or WhatsApp.',
} as const

export interface NavItem {
  readonly id: string
  readonly label: string
}

/** Section ids double as anchors. Order is page order. */
export const NAV: readonly NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'performance', label: 'Performance' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
]

export interface SocialLink {
  readonly label: string
  readonly url: string
  readonly handle: string
}

export const SOCIAL_LINKS: readonly SocialLink[] = [
  { label: CONTACT_CONFIG.instagram.label, url: CONTACT_CONFIG.instagram.url, handle: CONTACT_CONFIG.instagram.handle },
  { label: CONTACT_CONFIG.facebook.label, url: CONTACT_CONFIG.facebook.url, handle: CONTACT_CONFIG.facebook.handle },
]
