import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type MouseEvent,
} from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
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
  type CatalogScheme,
} from '../data'
import type { Role } from './auth/copy'
import { fetchCategories, fetchSchemes, type BackendScheme } from '../services/api'

const CATEGORY_DOTS: Record<string, string> = {
  Housing: 'bg-card-lavender',
  Food: 'bg-card-olive',
  Health: 'bg-card-sage',
  Farmer: 'bg-card-terracotta',
  Education: 'bg-card-mauve',
  Women: 'bg-brand-orange',
  Savings: 'bg-card-khaki',
  Pension: 'bg-brand-mint',
}

interface CatalogPageProps {
  role: Role
  onSelectScheme?: (schemeId: string) => void
}

export function CatalogPage({ role, onSelectScheme }: CatalogPageProps) {
  const isOfficer = role === 'officer'
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string>('All')
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(160)
  
  const [categoriesList, setCategoriesList] = useState<string[]>(['All', ...catalogCategories])
  const [schemes, setSchemes] = useState<CatalogScheme[]>(catalogSchemes)
  const [loading, setLoading] = useState(false)
  
  const scope = useRef<HTMLDivElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)

  // 1. Fetch Dynamic Categories from Backend (GET /api/schemes/categories)
  useEffect(() => {
    async function loadCategories() {
      const dynamicCats = await fetchCategories()
      if (dynamicCats && dynamicCats.length > 0) {
        setCategoriesList(['All', ...dynamicCats])
      }
    }
    loadCategories()
  }, [])

  // 2. Fetch Dynamic Schemes Catalog with 20 items per page pagination
  useEffect(() => {
    let isSubscribed = true
    async function loadSchemes() {
      setLoading(true)
      const selectedCategory = category === 'All' ? undefined : category
      const res = await fetchSchemes({
        category: selectedCategory,
        search: query.trim() ? query.trim() : undefined,
        page,
        limit: 20,
      })

      if (isSubscribed) {
        if (res.schemes && res.schemes.length > 0) {
          const mapped: CatalogScheme[] = res.schemes.map((b: BackendScheme) => ({
            id: b.id,
            title: b.title,
            category: b.category as any,
            tag: b.tag || b.category,
            description: b.description,
            benefit: b.benefit,
            eligibility: b.eligibility,
            matched: true,
          }))
          setSchemes(mapped)
          setTotalCount(res.count)
          setTotalPages(res.totalPages)
        } else if (!query.trim() && category === 'All' && page === 1) {
          setSchemes(catalogSchemes)
          setTotalCount(catalogSchemes.length)
          setTotalPages(Math.ceil(catalogSchemes.length / 20))
        } else {
          setSchemes([])
          setTotalCount(0)
          setTotalPages(1)
        }
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadSchemes()
    }, 200)

    return () => {
      isSubscribed = false
      clearTimeout(timer)
    }
  }, [category, query, page])

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
    setPage(1) // Reset to page 1 on new search
  }

  const handleCategory = (filter: string) => {
    return (e: MouseEvent<HTMLButtonElement>) => {
      pressChip(e.currentTarget)
      captureFlip()
      setCategory(filter)
      setPage(1) // Reset to page 1 on filter change
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      captureFlip()
      setPage((p) => p - 1)
      window.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }

  const handleNextPage = () => {
    if (page < totalPages) {
      captureFlip()
      setPage((p) => p + 1)
      window.scrollTo({ top: 200, behavior: 'smooth' })
    }
  }

  /* One-time entrance stagger, mount-only (Animations.md §3.2). */
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
    { scope, dependencies: [query, category, schemes, page] },
  )

  const startRange = totalCount === 0 ? 0 : (page - 1) * 20 + 1
  const endRange = Math.min(page * 20, totalCount)

  const headerCountLabel = category === 'All'
    ? `${totalCount} active schemes total`
    : `${totalCount} active schemes in ${category}`

  return (
    <div>
      <PageHeader
        title="Scheme catalog"
        subtitle={
          isOfficer
            ? 'Applications filed in your block, per scheme — review, verify and approve within the service window.'
            : 'Every active government scheme in one place — filter by category or search. Paginated 20 schemes per page.'
        }
        count={
          isOfficer
            ? `${totalCount} schemes total`
            : headerCountLabel
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
          placeholder="Search 160+ schemes, benefits or categories (e.g. farmer, housing)…"
          aria-label="Search schemes"
          className="w-full min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none max-md:py-2.5 max-md:text-[13px]"
        />
      </div>

      {/* Category chips — dynamically built from backend API */}
      <div
        className="mt-4 flex flex-wrap gap-2 max-md:flex-nowrap max-md:overflow-x-auto max-md:pb-1 max-md:no-scrollbar"
        role="group"
        aria-label="Filter by category"
      >
        {categoriesList.map((filter) => (
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

      {/* Range Status indicator */}
      <div className="mt-5 flex items-center justify-between text-xs text-ink-400">
        <p>
          Showing <span className="font-semibold text-ink-900">{startRange}–{endRange}</span> of{' '}
          <span className="font-semibold text-ink-900">{totalCount}</span> schemes
        </p>
        <p>
          Page <span className="font-semibold text-ink-900">{page}</span> of{' '}
          <span className="font-semibold text-ink-900">{totalPages}</span>
        </p>
      </div>

      {/* Grid */}
      <div
        ref={scope}
        className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2 max-md:mt-3 max-md:gap-3"
      >
        {schemes.map((scheme) =>
          isOfficer ? (
            <OfficerCatalogCard key={scheme.id} scheme={scheme} onViewDetails={() => onSelectScheme?.(scheme.id)} />
          ) : (
            <CatalogCard key={scheme.id} scheme={scheme} onViewDetails={() => onSelectScheme?.(scheme.id)} />
          ),
        )}
        {!loading && schemes.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-ink-400/40 bg-surface/60 px-6 py-10 text-center text-sm text-ink-400 max-md:px-4 max-md:py-8 max-md:text-[13px]">
            No schemes match “{query}”. Try a different search word or category.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-border-subtle pt-6">
          <button
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 py-2 text-xs font-semibold text-ink-700 shadow-soft transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-canvas"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            Previous
          </button>

          <div className="flex items-center gap-1 flex-wrap justify-center">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => {
                  captureFlip()
                  setPage(p)
                  window.scrollTo({ top: 200, behavior: 'smooth' })
                }}
                className={`h-8 w-8 rounded-full text-xs font-semibold transition-colors duration-150 ${
                  page === p
                    ? 'bg-brand-navy text-navy-contrast'
                    : 'text-ink-700 hover:bg-surface'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 py-2 text-xs font-semibold text-ink-700 shadow-soft transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:enabled:bg-canvas"
          >
            Next
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  )
}

function CatalogCard({ scheme, onViewDetails }: { scheme: CatalogScheme; onViewDetails: () => void }) {
  const dotClass = CATEGORY_DOTS[scheme.category] || 'bg-brand-orange'
  const tagText = scheme.tag || scheme.category

  return (
    <div className="catalog-card flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-[box-shadow,translate] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift max-md:p-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        <span className="ml-auto rounded-full bg-brand-mint/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3d7d6b] dark:text-[#7fd1bb]">
          {tagText}
        </span>
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
          onClick={onViewDetails}
          className="w-full rounded-[14px] bg-brand-navy text-navy-contrast hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange max-md:normal-case max-md:tracking-normal"
        >
          View Details & Apply
        </button>
      </div>
    </div>
  )
}

function OfficerCatalogCard({ scheme, onViewDetails }: { scheme: CatalogScheme; onViewDetails: () => void }) {
  const stats = officerSchemeStats[scheme.id]
  const pendingPct = stats
    ? Math.min(100, Math.round((stats.pending / stats.applications) * 100))
    : 0
  const dotClass = CATEGORY_DOTS[scheme.category] || 'bg-brand-orange'
  const tagText = scheme.tag || scheme.category

  return (
    <div className="catalog-card flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-[box-shadow,translate] duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift max-md:p-4">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${dotClass}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        {stats && stats.overdue > 0 ? (
          <span className="ml-auto rounded-full bg-brand-orange/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#b06a34] dark:text-[#f0a468]">
            {stats.overdue} overdue
          </span>
        ) : (
          <span className="ml-auto rounded-full bg-brand-mint/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3d7d6b] dark:text-[#7fd1bb]">
            {tagText}
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

      <div className="mt-auto pt-5 flex gap-2">
        <button
          onClick={onViewDetails}
          className="w-full rounded-[14px] bg-brand-navy px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-navy-contrast transition-colors duration-150 hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] focus-visible:outline-2 focus-visible:outline-brand-orange max-md:normal-case max-md:tracking-normal"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
