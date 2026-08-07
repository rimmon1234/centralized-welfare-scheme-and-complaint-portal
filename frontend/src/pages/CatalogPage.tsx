import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import {
  catalogCategories,
  catalogSchemes,
  type CatalogCategory,
  type CatalogScheme,
} from '../data'

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

export function CatalogPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')

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
        subtitle="Every active scheme in one place — filter by category or search. Matched schemes are ready to apply for."
        count={`${filtered.length} of ${catalogSchemes.length} schemes`}
      />

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-[20px] border border-border-subtle bg-surface p-1.5 shadow-soft">
        <Search
          className="ml-3 h-4 w-4 shrink-0 text-ink-400"
          strokeWidth={1.5}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search schemes, benefits or categories…"
          aria-label="Search schemes"
          className="w-full min-w-0 flex-1 bg-transparent px-2 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
        />
      </div>

      {/* Category chips */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setCategory(filter)}
            aria-pressed={category === filter}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
              category === filter
                ? 'bg-brand-navy text-white shadow-soft'
                : 'border border-border-subtle bg-surface text-ink-700 hover:text-ink-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((scheme) => (
          <CatalogCard key={scheme.id} scheme={scheme} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-ink-400/40 bg-surface/60 px-6 py-10 text-center text-sm text-ink-400">
            No schemes match “{query}”. Try a different word or category.
          </p>
        )}
      </div>
    </div>
  )
}

function CatalogCard({ scheme }: { scheme: CatalogScheme }) {
  return (
    <div className="flex flex-col rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-2">
        <span
          className={`h-2.5 w-2.5 rounded-full ${CATEGORY_DOTS[scheme.category]}`}
        />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        {scheme.matched && (
          <span className="ml-auto rounded-full bg-brand-mint/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#3d7d6b]">
            Matched ✓
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
        {scheme.title}
      </h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-700">
        {scheme.description}
      </p>
      <p className="mt-3 text-sm font-semibold text-brand-orange">
        {scheme.benefit}
      </p>
      <p className="mt-0.5 text-xs text-ink-400">
        Eligibility: {scheme.eligibility}
      </p>
      <div className="mt-auto pt-5">
        <button
          className={`w-full rounded-[14px] px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
            scheme.matched
              ? 'bg-brand-navy text-white hover:bg-[#2d2839]'
              : 'border border-brand-navy/25 text-brand-navy hover:bg-canvas'
          }`}
        >
          {scheme.matched ? 'Apply now' : 'Check eligibility'}
        </button>
      </div>
    </div>
  )
}
