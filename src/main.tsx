import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are self-hosted by Fontsource (no requests to Google).
// Newsreader: variable weight + optical-size axis (roman only; no italic is used).
import '@fontsource-variable/newsreader/opsz.css'
// Hanken Grotesk: variable weight.
import '@fontsource-variable/hanken-grotesk/wght.css'
import './styles/tokens.css'
import './styles/global.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
