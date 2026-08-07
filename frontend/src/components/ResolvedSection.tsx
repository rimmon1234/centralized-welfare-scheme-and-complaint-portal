import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock3,
} from 'lucide-react'
import { complaints, type Complaint, type Status } from '../data'

const STATUS_STYLES: Record<
  Status,
  { chip: string; dot: string; icon: typeof Clock3 }
> = {
  Resolved: {
    chip: 'bg-brand-mint/20 text-[#3d7d6b]',
    dot: 'bg-brand-mint',
    icon: CheckCircle2,
  },
  'Under review': {
    chip: 'bg-brand-orange/15 text-[#b06a34]',
    dot: 'bg-brand-orange',
    icon: Clock3,
  },
  Open: {
    chip: 'bg-brand-navy/10 text-brand-navy',
    dot: 'bg-brand-navy',
    icon: CircleAlert,
  },
}

export function ResolvedSection() {
  return (
    <section className="mt-10 lg:mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-[22px] font-semibold text-ink-900">
            Your reports &amp; updates
          </h2>
          <p className="mt-1 text-sm text-ink-400">
            Every complaint is public, trackable and time-bound.
          </p>
        </div>
        <button className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-navy focus-visible:outline-2 focus-visible:outline-brand-orange">
          View public dashboard
          <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
        </button>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {complaints.map((complaint) => (
          <ComplaintRow key={complaint.id} complaint={complaint} />
        ))}
      </ul>
    </section>
  )
}

function ComplaintRow({ complaint }: { complaint: Complaint }) {
  const style = STATUS_STYLES[complaint.status]
  const Icon = style.icon
  const resolved = complaint.status === 'Resolved'

  return (
    <li>
      <button
        className={`group flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 text-left shadow-soft transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-brand-orange sm:p-5 ${
          resolved ? 'opacity-80' : ''
        }`}
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            resolved
              ? 'bg-brand-mint/20 text-[#3d7d6b]'
              : 'bg-brand-navy/10 text-brand-navy'
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
    </li>
  )
}
