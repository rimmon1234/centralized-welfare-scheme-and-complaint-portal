import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import {
  Flip,
  gsap,
  pressChip,
  prefersReducedMotion,
  useGSAP,
} from '../lib/animations'
import {
  catalogCategories,
  catalogSchemes,
  officerSchemeStats,
  type CatalogCategory,
  type CatalogScheme,
} from '../data'
import type { Role } from './auth/copy'

const CATEGORY_DOTS: Record<CatalogCategory, string> = {
  Housing: 'bg-card-lavender',
  Food: 'bg-card-olive',
  Health: 'bg-card-sage',
  Farmer: 'bg-card-terracotta',
  Education: 'bg-card-mauve',
  Women: 'bg-brand-orange',
  Savings: 'bg-card-khaki',
  Pension: 'bg-brand-mint',
}

type CategoryFilter = CatalogCategory | 'All'
const filters: CategoryFilter[] = ['All', ...catalogCategories]

export function CatalogPage({ role }: { role: Role }) {
  const isOfficer = role === 'officer'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const scope = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)

  /* Snapshot the current card layout BEFORE the grid re-renders, so the
     FLIP transition can smoothly move cards into their new positions. */
  const captureFlip = () => {
    if (prefersReducedMotion()) return
    const cards = gsap.utils.toArray<HTMLElement>(
      '.catalog-card',
      scope.current as HTMLElement,
    )
    if (cards.length) flipState.current = Flip.getState(cards)
  }

  const handleQuery = (e: ChangeEvent<HTMLInputElement>) => {
    captureFlip()
    setQuery(e.target.value)
  }

  const handleCategory = (filter: CategoryFilter) => {
    return (e: MouseEvent<HTMLButtonElement>) => {
      pressChip(e.currentTarget)
      captureFlip()
      setCategory(filter)
    }
  }

  /* One-time entrance stagger, mount-only (Animations.md §3.2). Kept separate
     from the FLIP context so a filter change can never interrupt it. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {})
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cards = gsap.utils.toArray<HTMLElement>(
          '.catalog-card',
          scope.current as HTMLElement,
        )
        if (cards.length) {
          gsap.from(cards, {
            y: 16,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.out',
            stagger: 0.04,
            /* Return cards to pure CSS state afterwards so nothing lingers. */
            clearProps: 'transform,opacity',
          })
        }
      })
    },
    { scope },
  )

  /* FLIP-style grid transition on filter/search changes. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {})
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        if (flipState.current) {
          const state = flipState.current
          flipState.current = null
          Flip.from(state, {
            duration: 0.45,
            ease: 'power1.inOut',
            absolute: true,
            scale: true,
          })
        }
      })
    },
    { scope, dependencies: [query, category] },
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalogSchemes.filter((scheme) => {
      const inCategory = category === 'All' || scheme.category === category
      const inQuery =
        !q ||
        `${scheme.title} ${scheme.description} ${scheme.category} ${scheme.eligibility}`
          .toLowerCase()
          .includes(q)
      return inCategory && inQuery
    })
  }, [query, category])

  return (
    <div>
      <PageHeader
        title="Scheme catalog"
        subtitle={
          isOfficer
            ? 'Applications filed in your block, per scheme — review, verify and approve within the service window.'
            : 'Every active scheme in one place — filter by category or search. Matched schemes are ready to apply for.'
        }
        count={
          isOfficer
            ? `${filtered.length} schemes`
            : `${filtered.length} of ${catalogSchemes.length} schemes`
        }
      />

      {/* Search */}
      <div className="search-pulse mt-6 flex items-center gap-2 rounded-[20px] border border-border-subtle bg-surface p-1.5 shadow-soft max-md:mt-5">
        <Search
          className="ml-3 h-4 w-4 shrink-0 text-ink-400"
          strokeWidth={1.5}
        />
        <input
          value={query}
          onChange={handleQuery}
          placeholder="Search schemes, benefits or categories…"
          aria-label="Search schemes"
          className="w-full min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none max-md:py-2.5 max-md:text-[13px]"
        />
      </div>

      {/* Category chips — swipeable row on mobile (mobile plan §4) */}
      <div
        className="mt-4 flex flex-wrap gap-2 max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1 max-md:no-scrollbar"
        role="group"
        aria-label="Filter by category"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={handleCategory(filter)}
            aria-pressed={category === filter}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange max-md:min-h-11 ${
              category === filter
                ? 'bg-brand-navy text-navy-contrast shadow-soft'
                : 'border border-border-subtle bg-surface text-ink-700 hover:text-ink-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        ref={scope}
        className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 max-md:mt-5 max-md:gap-3"
      >
        {filtered.map((scheme) =>
          isOfficer ? (
            <OfficerCatalogCard key={scheme.id} scheme={scheme} />
          ) : (
            <CatalogCard key={scheme.id} scheme={scheme} />
          ),
        )}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-ink-400/40 bg-surface/60 px-6 py-10 text-center text-sm text-ink-400 max-md:px-4 max-md:py-8 max-md:text-[13px]">
            No schemes match “{query}”. Try a different word or category.
          </p>
        )}
      </div>
    </div>
  )
}

function CatalogCard({ scheme }: { scheme: CatalogScheme }) {
  return (
    <div className="catalog-card flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-[box-shadow,translate] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift max-md:p-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOTS[scheme.category]}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        {scheme.matched && (
          <span className="ml-auto rounded-full bg-brand-mint/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3d7d6b] dark:text-[#7fd1bb]">
            Matched ✓
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink-900 max-md:mt-2 max-md:text-base">
        {scheme.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-700 max-md:text-[13px]">
        {scheme.description}
      </p>
      <p className="mt-3 text-sm font-semibold text-brand-orange max-md:mt-2.5 max-md:text-[13px]">
        {scheme.benefit}
      </p>
      <p className="mt-0.5 text-xs text-ink-400 max-md:text-[11px]">
        Eligibility: {scheme.eligibility}
      </p>
      <div className="mt-auto pt-5">
        <button
          className={`w-full rounded-[14px] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange max-md:normal-case max-md:tracking-normal ${
            scheme.matched
              ? 'bg-brand-navy text-navy-contrast hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd]'
              : 'border border-brand-navy/25 text-brand-navy hover:bg-canvas'
          }`}
        >
          {scheme.matched ? 'Apply now' : 'Check eligibility'}
        </button>
      </div>
    </div>
  )
}

/* Officer variant — the same card system, but the CTA is a review queue
   and the status is the number of applications waiting in the block. */
function OfficerCatalogCard({ scheme }: { scheme: CatalogScheme }) {
  const stats = officerSchemeStats[scheme.id]
  const pendingPct = stats
    ? Math.min(100, Math.round((stats.pending / stats.applications) * 100))
    : 0
  return (
    <div className="catalog-card flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-[box-shadow,translate] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift max-md:p-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOTS[scheme.category]}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        {stats && stats.overdue > 0 && (
          <span className="ml-auto rounded-full bg-brand-orange/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#b06a34] dark:text-[#f0a468]">
            {stats.overdue} overdue
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink-900 max-md:mt-2 max-md:text-base">
        {scheme.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-700 max-md:text-[13px]">
        {scheme.description}
      </p>

      {stats && (
        <div className="mt-4 rounded-xl bg-canvas/60 px-4 py-3 max-md:mt-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-semibold text-ink-900">
              {stats.applications} applications
            </p>
            <p className="text-xs text-ink-400">{stats.pending} pending</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
            <div
              className="h-full rounded-full bg-brand-orange"
              style={{ width: `${pendingPct}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-ink-400">
            {stats.pending > 0
              ? `${stats.pending} await your review within the 7-day window.`
              : 'All applications reviewed — nothing pending.'}
          </p>
        </div>
      )}

      <div className="mt-auto pt-5">
        <button
          className="w-full rounded-[14px] bg-brand-navy px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-navy-contrast transition-colors duration-150 hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] focus-visible:outline-2 focus-visible:outline-brand-orange max-md:normal-case max-md:tracking-normal"
        >
          Review applications
        </button>
      </div>
    </div>
  )
}
