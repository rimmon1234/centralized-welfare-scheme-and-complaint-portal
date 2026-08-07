import { useState } from 'react'
import { MapPin, Paperclip, ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { Toggle } from '../components/Toggle'
import {
  emergencyContacts,
  helplineSteps,
  reportCategories,
} from '../data'

export function HelplinePage() {
  const [category, setCategory] = useState<string>(reportCategories[0])
  const [desc, setDesc] = useState('')
  const [evidence, setEvidence] = useState(false)
  const [located, setLocated] = useState(true)
  const [anonymous, setAnonymous] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submittedCategory, setSubmittedCategory] = useState<string>(reportCategories[0])

  const submit = () => {
    if (!desc.trim()) return
    setSubmittedCategory(category)
    setSubmitted(true)
    setDesc('')
    setEvidence(false)
  }

  return (
    <div>
      <PageHeader
        title="Helpline"
        subtitle="Report civic issues, harassment or corruption — anonymously, with evidence and automatic geotagging."
      />

      {/* Anonymity banner */}
      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-mint/20 px-5 py-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-orange">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <p className="text-[13px] leading-relaxed text-ink-900">
          <strong>100% anonymous.</strong> Officials see only a reference ID —
          never your name, number or Aadhaar. Reports are geotagged and
          timestamped.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Report form */}
        <div className="rounded-[24px] border border-border-subtle bg-surface p-6 shadow-soft sm:p-8 lg:col-span-2">
          <h3 className="font-display text-xl font-semibold text-ink-900">
            Describe the issue
          </h3>

          <div
            className="mt-4 flex flex-wrap gap-2"
            role="group"
            aria-label="Issue category"
          >
            {reportCategories.map((option) => (
              <button
                key={option}
                onClick={() => setCategory(option)}
                aria-pressed={category === option}
                className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
                  category === option
                    ? 'bg-brand-navy text-white shadow-soft'
                    : 'border border-border-subtle bg-canvas/50 text-ink-700 hover:text-ink-900'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <label
            htmlFor="issue-desc"
            className="mt-6 block text-[13px] font-semibold text-ink-900"
          >
            What happened?{' '}
            <span className="font-normal text-ink-400">(min 10 characters)</span>
          </label>
          <textarea
            id="issue-desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="Example: Street lights on College Road have been out for a week; two women were harassed near the market last evening…"
            className="mt-2 w-full resize-none rounded-2xl border border-border-subtle bg-canvas/50 px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:border-brand-orange/60 focus:outline-none"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              onClick={() => setEvidence(!evidence)}
              aria-pressed={evidence}
              className={`flex items-center gap-2 rounded-[14px] border px-4 py-3 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
                evidence
                  ? 'border-brand-mint bg-brand-mint/15 text-[#3d7d6b]'
                  : 'border-dashed border-ink-400/50 text-ink-700 hover:border-brand-orange/60 hover:text-ink-900'
              }`}
            >
              <Paperclip className="h-4 w-4" strokeWidth={1.5} />
              {evidence ? '2 files attached · photo + video' : 'Add photo or video evidence'}
            </button>
            <button
              onClick={() => setLocated(!located)}
              aria-pressed={located}
              className={`flex items-center gap-2 rounded-[14px] border px-4 py-3 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
                located
                  ? 'border-brand-mint bg-brand-mint/15 text-[#3d7d6b]'
                  : 'border-dashed border-ink-400/50 text-ink-700 hover:border-brand-orange/60 hover:text-ink-900'
              }`}
            >
              <MapPin className="h-4 w-4" strokeWidth={1.5} />
              {located
                ? 'Auto-located · Ward 12, College Road'
                : 'Add location automatically'}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-canvas/70 px-5 py-4">
            <div>
              <p className="text-[13px] font-semibold text-ink-900">
                Stay anonymous
              </p>
              <p className="text-xs text-ink-400">
                Officials see a reference ID, never your name.
              </p>
            </div>
            <Toggle
              checked={anonymous}
              onChange={() => setAnonymous(!anonymous)}
              label="Stay anonymous"
            />
          </div>

          <button
            onClick={submit}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-[16px] bg-brand-navy px-6 py-4 text-[13px] font-semibold uppercase tracking-[0.04em] text-white transition-colors duration-150 hover:bg-[#2d2839] focus-visible:outline-2 focus-visible:outline-brand-orange"
          >
            <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
            Submit anonymous report
          </button>

          {submitted && (
            <p
              role="status"
              className="mt-4 flex items-start gap-2 rounded-2xl bg-brand-mint/20 px-4 py-3 text-[13px] font-medium leading-relaxed text-ink-900"
            >
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-navy" />
              <span>
                Report <strong>{submittedCategory}</strong> filed anonymously —
                reference <strong>SR-1045</strong>. Track it on your Overview.
                If unresolved in 7 days, it escalates to the block officer
                automatically.
              </span>
            </p>
          )}
        </div>

        {/* Right rail */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold text-ink-900">
              Emergency contacts
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {emergencyContacts.map((contact) => {
                const Icon = contact.icon
                return (
                  <li key={contact.number}>
                    <a
                      href={`tel:${contact.number}`}
                      className="flex w-full items-center gap-3 rounded-xl bg-canvas/60 px-4 py-3 text-left transition-colors duration-150 hover:bg-canvas focus-visible:outline-2 focus-visible:outline-brand-orange"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-orange">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span className="flex-1 text-[13px] font-medium text-ink-900">
                        {contact.label}
                      </span>
                      <span className="font-display text-lg font-semibold text-ink-900">
                        {contact.number}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
            <p className="mt-3 text-xs text-ink-400">Tap to call · works 24×7</p>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6 shadow-soft">
            <h3 className="font-display text-base font-semibold text-ink-900">
              How it works
            </h3>
            <ol className="mt-4 flex flex-col gap-4">
              {helplineSteps.map((step, i) => (
                <li key={step.title} className="relative flex gap-3 pl-1">
                  {i < helplineSteps.length - 1 && (
                    <span className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-border-subtle" />
                  )}
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy font-display text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-ink-900">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-400">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl bg-brand-mint/15 p-6">
            <p className="text-[13px] font-semibold text-ink-900">
              Why this matters
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-700">
              Over 70% of complaints in the pilot wards were resolved within the
              7-day window. Every escalation is logged publicly on the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
