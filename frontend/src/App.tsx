import { useState } from 'react'
import { DecorativeBackground } from './components/DecorativeBackground'
import { AuthPage } from './pages/auth/AuthPage'
import type { Role } from './pages/auth/copy'
import { OfficerPage } from './pages/officer/OfficerPage'
import { OfficerMapPage } from './pages/officer/OfficerMapPage'
import { OfficerProfilePage } from './pages/officer/OfficerProfilePage'
import { OfficerHelplinePage } from './pages/officer/OfficerHelplinePage'
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

const AUTH_KEY = 'sevanest-auth'

/** Persists which role is signed in (UI-only mock): returns the stored role,
 *  or null when nobody is signed in. */
function readAuthRole(): Role | null {
  try {
    const v = localStorage.getItem(AUTH_KEY)
    return v === 'citizen' || v === 'officer' ? v : null
  } catch {
    return null
  }
}

export default function App() {
  const [tab, setTab] = useState<TabId>('overview')
  const { theme, toggle } = useTheme()
  /* UI-only mock gate: the AuthPage signs the demo session in/out locally. */
  const [authed, setAuthed] = useState<boolean>(() => readAuthRole() !== null)
  const [role, setRole] = useState<Role>(() => readAuthRole() ?? 'citizen')

  const signIn = (r: Role) => {
    try {
      localStorage.setItem(AUTH_KEY, r)
    } catch {
      /* storage unavailable — session still signs in */
    }
    setRole(r)
    setAuthed(true)
  }

  const signOut = () => {
    try {
      localStorage.removeItem(AUTH_KEY)
    } catch {
      /* ignore */
    }
    setRole('citizen')
    setAuthed(false)
    setTab('overview')
  }

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

  if (!authed) {
    return (
      <div className="min-h-screen bg-canvas font-sans text-ink-900">
        <DecorativeBackground insetForSidebar={false} />
        <AuthPage theme={theme} onToggleTheme={toggleTheme} onSignIn={signIn} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink-900">
      <DecorativeBackground />

      <MobileHeader
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignOut={signOut}
        role={role}
      />
      <Sidebar
        active={tab}
        onSelect={setTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSignOut={signOut}
        role={role}
      />

      <div className="relative z-10 lg:pl-[264px]">
        {/* key={tab} re-mounts the content per tab so the page-enter
            transition plays on every switch (Animations.md §3.2) */}
        <main
          key={tab}
          className="page-enter mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-10 lg:px-12 lg:py-10"
        >
          {tab === 'overview' &&
            /* Officers get their own desk view; the other tabs stay shared
               for now — a glimpse, not a full staff workspace. */
            (role === 'officer' ? (
              <OfficerPage />
            ) : (
              <>
                <Hero />
                <SchemesSection />
                <ResolvedSection />
              </>
            ))}
          {tab === 'map' && role === 'officer' && <OfficerMapPage />}
          {tab === 'chat' && <ChatPage role={role} />}
          {tab === 'profile' &&
            (role === 'officer' ? <OfficerProfilePage /> : <ProfilePage />)}
          {tab === 'schemes' && <CatalogPage role={role} />}
          {tab === 'helpline' &&
            (role === 'officer' ? (
              <OfficerHelplinePage />
            ) : (
              <HelplinePage />
            ))}
          <Footer />
        </main>
      </div>
    </div>
  )
}
