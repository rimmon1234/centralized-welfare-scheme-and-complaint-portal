import { useState } from 'react'
import { DecorativeBackground } from './components/DecorativeBackground'
import { Sidebar } from './components/Sidebar'
import { MobileHeader } from './components/MobileHeader'
import { Hero } from './components/Hero'
import { SchemesSection } from './components/SchemesSection'
import { ResolvedSection } from './components/ResolvedSection'
import { Footer } from './components/Footer'
import { ChatPage } from './pages/ChatPage'
import { ProfilePage } from './pages/ProfilePage'
import { CatalogPage } from './pages/CatalogPage'
import { HelplinePage } from './pages/HelplinePage'
import { useTheme } from './hooks/useTheme'
import type { TabId } from './data'

export default function App() {
  const [tab, setTab] = useState<TabId>('overview')
  const { theme, toggle } = useTheme()

  /* Theme crossfade (Animations.md §4 Phase 2): let colors ease for ~300ms
     while the `dark` class flips, then remove the transitional class. */
  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.add('theme-fade-active')
    window.setTimeout(
      () => root.classList.remove('theme-fade-active'),
      350,
    )
    toggle()
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink-900">
      <DecorativeBackground />

      <MobileHeader
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <Sidebar
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="relative z-10 lg:pl-[264px]">
        {/* key={tab} re-mounts the content per tab so the page-enter
            transition plays on every switch (Animations.md §3.2) */}
        <main
          key={tab}
          className="page-enter mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-10 lg:px-12 lg:py-10"
        >
          {tab === 'overview' && (
            <>
              <Hero />
              <SchemesSection />
              <ResolvedSection />
            </>
          )}
          {tab === 'chat' && <ChatPage />}
          {tab === 'profile' && <ProfilePage />}
          {tab === 'schemes' && <CatalogPage />}
          {tab === 'helpline' && <HelplinePage />}
          <Footer />
        </main>
      </div>
    </div>
  )
}
