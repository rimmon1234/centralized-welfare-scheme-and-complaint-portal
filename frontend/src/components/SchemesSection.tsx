import { useMemo, useRef, useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { schemes } from '../data'
import { SchemeCard } from './SchemeCard'
import { ComplaintBar } from './ComplaintBar'

export function SchemesSection() {
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return schemes
    return schemes.filter((s) =>
      `${s.title} ${s.tag} ${s.benefit}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <section className="mt-10 lg:mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-semibold text-ink-900">
            Schemes matched for you
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            Based on your income, family &amp; occupation profile.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-ink-700 shadow-soft">
          {filtered.length} matches
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {filtered.map((scheme) => (
          <SchemeCard key={scheme.id} scheme={scheme} />
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full rounded-2xl border border-dashed border-ink-400/40 bg-surface/60 px-6 py-8 text-center text-sm text-ink-400">
            No scheme matches “{query}” yet — but you can still file it as an
            anonymous complaint below.
          </p>
        )}

        <AddNewCard
          expanded={expanded}
          onToggle={() => {
            setExpanded((v) => !v)
            inputRef.current?.focus()
          }}
        />
      </div>

      <ComplaintBar
        query={query}
        onQueryChange={setQuery}
        inputRef={inputRef}
      />
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
    <button
      onClick={onToggle}
      className="group flex min-h-44 flex-col rounded-2xl border border-border-subtle bg-surface p-6 text-left transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-orange"
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
  )
}
