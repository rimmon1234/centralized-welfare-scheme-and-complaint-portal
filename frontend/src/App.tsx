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

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink-900">
      <DecorativeBackground />

      <MobileHeader
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggle}
      />
      <Sidebar
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggle}
      />

      <div className="relative z-10 lg:pl-[264px]">
        <main className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-10 lg:px-12 lg:py-10">
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
