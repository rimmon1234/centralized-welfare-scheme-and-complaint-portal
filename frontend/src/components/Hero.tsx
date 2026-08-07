import { useRef } from 'react'
import { GuideCard } from './GuideCard'
import { stats, user } from '../data'
import { gsap, useGSAP } from '../lib/animations'

export function Hero() {
  const scope = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      // Reduced motion: static render.
      mm.add('(prefers-reduced-motion: reduce)', () => {})

      // One signature sequence (Animations.md §3.1): eyebrow → greeting →
      // subtext → stat pills → guide card, then the numbers count up.
      mm.add(
        '(min-width: 640px) and (prefers-reduced-motion: no-preference)',
        () => {
          const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

          tl.from('[data-hero="eyebrow"]', { y: 16, opacity: 0, duration: 0.5 })
            .from(
              '[data-hero="title"]',
              { y: 16, opacity: 0, duration: 0.5 },
              '-=0.3',
            )
            .from(
              '[data-hero="sub"]',
              { y: 12, opacity: 0, duration: 0.45 },
              '-=0.35',
            )
            .from(
              '[data-hero="stat"]',
              { y: 12, opacity: 0, duration: 0.45, stagger: 0.06 },
              '-=0.3',
            )
            .from(
              '[data-hero="guide"]',
              { scale: 0.96, opacity: 0, duration: 0.5 },
              '-=0.25',
            )

          // Count-up the stat numbers once the pills land.
          const counters = gsap.utils.toArray<HTMLElement>(
            '[data-hero="stat-num"]',
            scope.current as HTMLElement,
          )
          counters.forEach((el) => {
            const raw = el.dataset.value ?? '0'
            const match = raw.match(/^([\d.]+)\s*(.*)$/)
            if (!match) return
            const target = parseFloat(match[1])
            const suffix = match[2].trim()
            const decimals = match[1].includes('.') ? 1 : 0
            const proxy = { v: 0 }
            tl.to(
              proxy,
              {
                v: target,
                duration: 1.2,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = `${proxy.v.toFixed(decimals)}${
                    suffix ? ` ${suffix}` : ''
                  }`
                },
              },
              '<',
            )
          })
        },
      )
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      className="hero-band relative overflow-hidden rounded-[28px] px-6 py-10 shadow-soft sm:px-10 lg:px-12 lg:py-12"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          <span
            data-hero="eyebrow"
            className="inline-flex items-center gap-2 rounded-full bg-surface/70 px-3 py-1.5 text-xs font-medium text-ink-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />
            Monday, 8 August · Bengal District Services
          </span>

          <h1
            data-hero="title"
            className="mt-5 font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-[40px]"
          >
            Hi, {user.name.split(' ')[0]}! 👋
          </h1>
          <p
            data-hero="sub"
            className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-700"
          >
            Here's what matters today — welfare schemes matched to your life,
            and the status of everything you've reported.
          </p>

          <dl className="mt-8 flex flex-wrap gap-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="rounded-2xl bg-surface/75 px-4 py-3 backdrop-blur-sm"
              >
                <dt className="text-[11px] font-medium uppercase tracking-wide text-ink-400">
                  {stat.label}
                </dt>
                <dd
                  data-hero="stat-num"
                  data-value={stat.value}
                  className="mt-0.5 font-display text-xl font-semibold text-ink-900"
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div data-hero="guide">
          <GuideCard />
        </div>
      </div>
    </section>
  )
}
