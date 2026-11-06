import { lazy, Suspense, useEffect, useState } from 'react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { FloatingActions } from './components/FloatingActions'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Performance } from './components/Performance'
import { NAV } from './content/site'
import { useActiveSection } from './hooks/useActiveSection'

/**
 * The media review page exists only while developing. `import.meta.env.DEV` is a
 * build-time constant, so in the production build this becomes `null` and the page
 * (and its code) is removed entirely.
 */
const MediaReview = import.meta.env.DEV ? lazy(() => import('./dev/MediaReview.tsx')) : null

const SECTION_IDS = NAV.map((item) => item.id)

function useHash(): string {
  const [hash, setHash] = useState(() => window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

function Site() {
  const activeId = useActiveSection(SECTION_IDS)
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header activeId={activeId} />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Performance />
        <Gallery />
        <Contact />
      </main>
      <FloatingActions />
    </>
  )
}

export default function App() {
  const hash = useHash()

  if (MediaReview && hash === '#media-review') {
    return (
      <Suspense fallback={null}>
        <MediaReview />
      </Suspense>
    )
  }

  return <Site />
}
