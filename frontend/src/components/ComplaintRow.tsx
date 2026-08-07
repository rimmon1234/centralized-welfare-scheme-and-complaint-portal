import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
} from 'lucide-react'
import type { Complaint, Status } from '../data'

const STATUS_STYLES: Record<
  Status,
  { chip: string; dot: string; icon: typeof Clock3 }
> = {
  Resolved: {
    chip: 'bg-brand-mint/20 text-[#3d7d6b] dark:text-[#7fd1bb]',
    dot: 'bg-brand-mint',
    icon: CheckCircle2,
  },
  'Under review': {
    chip: 'bg-brand-orange/15 text-[#b06a34] dark:text-[#f0a468]',
    dot: 'bg-brand-orange',
    icon: Clock3,
  },
  Open: {
    chip: 'bg-brand-navy/10 text-brand-navy dark:bg-[#f2f0ec]/15 dark:text-[#f2f0ec]',
    dot: 'bg-brand-navy',
    icon: CircleAlert,
  },
}

/** One complaint row — shared by the citizen reports list and the officer
 *  case log so both sides of the portal read identically (design.md §7). */
export function ComplaintRow({ complaint }: { complaint: Complaint }) {
  const style = STATUS_STYLES[complaint.status]
  const Icon = style.icon
  const resolved = complaint.status === 'Resolved'

  return (
    <button
      className={`group flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-soft transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-orange sm:p-5 ${
        resolved ? 'opacity-80' : ''
      }`}
    >
      <span
        data-pop={resolved ? '' : undefined}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          resolved
            ? 'bg-brand-mint/20 text-[#3d7d6b] dark:text-[#7fd1bb]'
            : 'bg-brand-navy/10 text-brand-navy dark:bg-[#f2f0ec]/15 dark:text-[#f2f0ec]'
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold text-ink-900">
          {complaint.title}
        </span>
        <span className="mt-0.5 block truncate text-xs text-ink-400">
          {complaint.ref} · {complaint.location} · filed {complaint.time}
        </span>
      </span>

      <span
        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.chip}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {resolved
          ? `Resolved · ${complaint.days} days`
          : complaint.status === 'Under review'
            ? `Under review · Day ${complaint.days}`
            : 'Open · auto-escalates at 7 days'}
      </span>

      <ArrowRight className="h-4 w-4 shrink-0 text-ink-400 transition-transform duration-150 group-hover:translate-x-0.5" />
    </button>
  )
}
