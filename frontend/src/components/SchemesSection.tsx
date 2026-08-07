import { useMemo, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { schemes } from '../data'
import { SchemeCard, CARD_COLORS } from './SchemeCard'
import { ListRow } from './ListRow'
import { ComplaintBar } from './ComplaintBar'
import { useReveal } from '../hooks/useReveal'

export function SchemesSection() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const scope = useReveal<HTMLElement>()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return schemes
    return schemes.filter((s) =>
      `${s.title} ${s.tag} ${s.benefit}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <section ref={scope} className="mt-10 lg:mt-12 max-md:mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-semibold text-ink-900 max-md:text-base">
            Schemes matched for you
          </h2>
          <p className="mt-1 text-sm text-ink-400 max-md:mt-0.5 max-md:text-[13px]">
            Based on your income, family &amp; occupation profile.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-700 shadow-soft max-md:px-2.5 max-md:text-[11px]">
          {filtered.length} matches
        </span>
      </div>

      {/* Mobile plan §2: full-width colour cards become a continuous list of
          compact rows below md; the desktop card grid is untouched. */}
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5 max-md:mt-4 max-md:flex max-md:flex-col max-md:gap-0 max-md:overflow-hidden max-md:rounded-2xl max-md:border max-md:border-border-subtle max-md:bg-surface max-md:divide-y max-md:divide-border-subtle">
        {filtered.map((scheme) => (
          <div data-reveal key={scheme.id}>
            <SchemeCard scheme={scheme} />
            <div className="md:hidden">
              <ListRow
                tileClass={CARD_COLORS[scheme.color]}
                illustration={scheme.illustration}
                title={scheme.title}
                meta={scheme.benefit}
                chip={{
                  label: scheme.match,
                  tone: scheme.match === 'Likely eligible' ? 'mint' : 'orange',
                }}
              />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-ink-400/40 bg-surface/60 px-6 py-8 text-center text-sm text-ink-400 max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:px-4 max-md:py-6 max-md:text-[13px]">
            No scheme matches “{query}” yet — but you can still file it as an
            anonymous complaint below.
          </p>
        )}

        <div data-reveal>
          <AddNewCard
            expanded={expanded}
            onToggle={() => {
              setExpanded((v) => !v)
              inputRef.current?.focus()
            }}
          />
        </div>
      </div>

      <div data-reveal>
        <ComplaintBar
          query={query}
          onQueryChange={setQuery}
          inputRef={inputRef}
        />
      </div>
    </section>
  )
}

function AddNewCard({
  expanded,
  onToggle,
}: {
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <>
      <button
        onClick={onToggle}
        className="group flex h-full w-full min-h-44 flex-col rounded-2xl border border-border-subtle bg-surface p-6 text-left transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-orange max-md:hidden"
      >
        <div className="flex items-start justify-between">
          <p className="text-[15px] font-semibold text-ink-900">
            Search all schemes
          </p>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-subtle text-ink-700 transition-transform duration-150 group-hover:rotate-90">
            {expanded ? (
              <Minus className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Plus className="h-4 w-4" strokeWidth={1.5} />
            )}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-400">
          Browse the full catalog or type a scheme name in the search bar below.
        </p>
        <p className="mt-auto pt-4 text-xs font-medium text-brand-orange">
          Open catalog →
        </p>
      </button>

      {/* Mobile: the same action as a compact row in the divided list. */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition-colors duration-150 active:bg-canvas/70 focus-visible:outline-2 focus-visible:outline-brand-orange md:hidden"
      >
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-ink-900">
            Search all schemes
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-ink-400">
            Browse the full catalog or type a scheme name below.
          </span>
        </span>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-subtle text-ink-700">
          {expanded ? (
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          ) : (
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          )}
        </span>
        <span className="text-xs font-semibold text-brand-orange">Catalog →</span>
      </button>
    </>
  )
}
