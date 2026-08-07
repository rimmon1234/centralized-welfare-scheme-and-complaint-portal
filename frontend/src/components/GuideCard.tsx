import { ArrowRight } from 'lucide-react'
import { user } from '../data'

const steps = [
  { label: 'Eligibility', done: true },
  { label: 'Documents', done: true },
  { label: 'Apply', done: false },
  { label: 'Track', done: false },
]

export function GuideCard() {
  return (
    <div className="relative ml-auto w-full max-w-sm rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
      <p className="font-display text-xl font-semibold text-ink-900">
        Your welfare guide
      </p>
      <p className="mt-1.5 text-[13px] text-ink-400">{user.meta}</p>

      {/* Thin progress path: spiral flourish → line → orange progress dot */}
      <div className="mt-7">
        <div className="relative flex items-center">
          <svg
            viewBox="0 0 48 12"
            className="h-3 w-14 shrink-0 text-brand-orange"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M2 6 C 10 0, 18 12, 26 6 S 40 0, 46 6" />
          </svg>
          <div className="h-px flex-1 bg-ink-900/10" />
          <span className="absolute right-[6%] h-2.5 w-2.5 rounded-full bg-brand-orange" />
        </div>
        <ol className="mt-3 flex justify-between gap-1 text-[11px] font-medium text-ink-400">
          {steps.map((step) => (
            <li key={step.label} className={step.done ? 'text-brand-navy' : ''}>
              {step.done ? '✓ ' : ''}
              {step.label}
            </li>
          ))}
        </ol>
      </div>

      <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-[14px] bg-brand-navy px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-navy-contrast transition-colors duration-150 hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] focus-visible:outline-2 focus-visible:outline-brand-orange">
        Continue PM-Kisan application
        <ArrowRight className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}
