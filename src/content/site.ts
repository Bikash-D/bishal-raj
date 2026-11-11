
/**
 * Site content. Everything here is supplied by Bishal's team.
 * No credits, awards, representation or testimonials are invented.
 *
 * This file must stay free of import.meta.env and bundler-only imports:
 * scripts/build-profile-pdf.mjs imports it directly with Node.
 */

/**
 * Public contact details confirmed by the owner.
 * All contact information is centralized here.
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
  intro: 'Bishal Raj is an emerging Nepali actor with theatre training at Nachghar and Mandala Theatre.',
  openTo: ['Film', 'Television', 'Theatre', 'Commercials', 'Digital productions'],
} as const

/** Hero introduction. */
export const HERO_INTRO =
  'An emerging Nepali actor exploring character, emotion and the human experience through performance.'

/**
 * Confirmed theatre training and certificates.
 * No unconfirmed course titles, dates or qualifications are claimed.
 */
export const TRAININGS = [
  {
    label: 'Theatre Training',
    institution: 'Nachghar',
    status: 'Certificate Holder',
  },
  {
    label: 'Theatre Training',
    institution: 'Mandala Theatre',
    status: 'Certificate Holder',
  },
] as const

/** Key facts displayed beneath the actor's name. */
export const HERO_FACTS: readonly string[] = [
  'Nachghar & Mandala Theatre',
  'Nepali Theatre & Performance',
]

export const ABOUT = {
  lead: 'Grounded in theatre. Open to new stories.',
  paragraphs: [
    'Bishal Raj is an emerging Nepali actor with theatre training at Nachghar and Mandala Theatre. He holds certificates from both institutions and performs primarily in Nepali.',
    'He is open to opportunities across film, television, theatre, commercials and digital productions.',
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
  {
    label: CONTACT_CONFIG.instagram.label,
    url: CONTACT_CONFIG.instagram.url,
    handle: CONTACT_CONFIG.instagram.handle,
  },
  {
    label: CONTACT_CONFIG.facebook.label,
    url: CONTACT_CONFIG.facebook.url,
    handle: CONTACT_CONFIG.facebook.handle,
  },
]
