import { GuideCard } from './GuideCard'
import { stats, user } from '../data'

export function Hero() {
  return (
    <section className="hero-band relative overflow-hidden rounded-[28px] px-6 py-10 shadow-soft sm:px-10 lg:px-12 lg:py-12">
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-xs font-medium text-ink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Monday, 8 August · Bengal District Services
          </span>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-[40px]">
            Hi, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-700">
            Here's what matters today — welfare schemes matched to your life,
            and the status of everything you've reported.
          </p>

          <dl className="mt-8 flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-surface/75 px-4 py-3 backdrop-blur-sm"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {stat.label}
                </dt>
                <dd className="mt-0.5 font-display text-xl font-semibold text-ink-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <GuideCard />
      </div>
    </section>
  )
}
