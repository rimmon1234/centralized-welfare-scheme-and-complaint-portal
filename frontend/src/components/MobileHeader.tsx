import { LogOut } from 'lucide-react'
import { tabs, user, type TabId } from '../data'
import type { Theme } from '../hooks/useTheme'
import { useNavPillSettle } from '../hooks/useNavPillSettle'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

interface MobileHeaderProps {
  active: TabId
  onSelect: (id: TabId) => void
  theme: Theme
  onToggleTheme: () => void
  onSignOut: () => void
}

export function MobileHeader({
  active,
  onSelect,
  theme,
  onToggleTheme,
  onSignOut,
}: MobileHeaderProps) {
  /* Active pill settles in on tab switch (Animations.md §3.2). */
  const scope = useNavPillSettle(active)

  return (
    <header
      ref={scope}
      className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/85 backdrop-blur lg:hidden"
    >
      <div className="flex items-center justify-between px-5 py-3">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            onClick={onSignOut}
            aria-label="Sign out (demo)"
            title="Sign out (demo)"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface text-ink-700 shadow-soft transition-colors duration-150 hover:text-brand-orange focus-visible:outline-2 focus-visible:outline-brand-orange"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-[#c97a45] text-xs font-semibold text-white">
              {user.initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-canvas bg-brand-mint" />
          </div>
        </div>
      </div>
      <nav
        className="flex gap-1.5 overflow-x-auto px-5 pb-3"
        aria-label="Primary"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelect(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
                isActive
                  ? 'bg-brand-navy text-navy-contrast'
                  : 'text-ink-400 hover:bg-surface hover:text-ink-900'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              {tab.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
