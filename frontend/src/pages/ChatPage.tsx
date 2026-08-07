import { useEffect, useRef, useState } from 'react'
import { Mic, Send } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { gsap, useGSAP } from '../lib/animations'
import {
  botReplies,
  catalogSchemes,
  introMessages,
  languages,
  officerBotReplies,
  officerIntroMessages,
  officerQuickReplies,
  quickReplies,
} from '../data'
import type { Role } from './auth/copy'

interface ChatMessage {
  id: number
  role: 'bot' | 'user'
  text: string
  schemeId?: string
}

const LANG_NAMES: Record<string, string> = {
  bn: 'Bengali',
  hi: 'Hindi',
  en: 'English',
}

const citizenInitialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'bot',
    text: 'নমস্কার, Asha! 🙏 I\u2019m Sahayak — your welfare assistant. Ask me anything in Bengali, Hindi or English, by text or voice.',
  },
  {
    id: 2,
    role: 'bot',
    text: 'Good news: your documents are verified for 6 schemes right now. Here is the easiest one to start with 👇',
    schemeId: 'pmkisan',
  },
]

const officerInitialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'bot',
    text: officerIntroMessages.bn,
  },
  {
    id: 2,
    role: 'bot',
    text: 'Your desk: 7 reports awaiting action. The closest to the deadline is SR-1041 (Day 6 of 7). Here is what is queued for review 👇',
    schemeId: 'pmkisan',
  },
]

export function ChatPage({ role }: { role: Role }) {
  const isOfficer = role === 'officer'
  const [language, setLanguage] = useState('bn')
  const [messages, setMessages] = useState<ChatMessage[]>(
    isOfficer ? officerInitialMessages : citizenInitialMessages,
  )
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [listening, setListening] = useState(false)
  const replyIndex = useRef(0)
  const idRef = useRef(3)
  const scrollRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<number[]>([])
  const lastAnimated = useRef(0)

  /* iMessage-style bubble pops (Animations.md §3.2): every newly appended
     message scales/fades in; its embedded scheme card slides up after. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: reduce)', () => {})
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // scrollRef is the bottom anchor; its parent is the scroll container.
        const container = scrollRef.current?.parentElement
        if (!container) return
        const fresh = gsap.utils
          .toArray<HTMLElement>('[data-msg-id]', container)
          .filter((el) => Number(el.dataset.msgId) > lastAnimated.current)
        if (!fresh.length) return

        gsap.fromTo(
          fresh,
          { scale: 0.94, y: 8, opacity: 0 },
          {
            scale: 1,
            y: 0,
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
            stagger: 0.04,
            overwrite: true,
          },
        )
        fresh.forEach((el) => {
          const card = el.querySelector<HTMLElement>('[data-scheme-card]')
          if (card) {
            gsap.fromTo(
              card,
              { y: 14, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                delay: 0.08,
                overwrite: true,
              },
            )
          }
        })

        lastAnimated.current = Number(fresh[fresh.length - 1].dataset.msgId)
      })
    },
    { scope: scrollRef, dependencies: [messages] },
  )

  const schedule = (fn: () => void, ms: number) => {
    timersRef.current.push(window.setTimeout(fn, ms))
  }

  const append = (message: Omit<ChatMessage, 'id'>) => {
    const id = idRef.current++
    setMessages((prev) => [...prev, { ...message, id }])
  }

  const botReply = (schemeId?: string) => {
    const replies = isOfficer ? officerBotReplies : botReplies
    setTyping(true)
    schedule(() => {
      setTyping(false)
      append({
        role: 'bot',
        text: replies[replyIndex.current % replies.length],
        schemeId,
      })
      replyIndex.current += 1
    }, 1200)
  }

  const send = () => {
    const text = input.trim()
    if (!text || typing || listening) return
    setInput('')
    append({ role: 'user', text })
    botReply()
  }

  const sendQuick = (text: string) => {
    append({ role: 'user', text })
    botReply()
  }

  const switchLanguage = (id: string) => {
    if (id === language) return
    setLanguage(id)
    append({
      role: 'bot',
      text: isOfficer ? officerIntroMessages[id] : introMessages[id],
    })
  }

  const startVoice = () => {
    if (listening || typing) return
    setListening(true)
    schedule(() => {
      setListening(false)
      append({
        role: 'user',
        text: isOfficer
          ? '🎤 “Which reports are due this week?”'
          : '🎤 “Am I eligible for a housing scheme?”',
      })
      setTyping(true)
      schedule(() => {
        setTyping(false)
        append(
          isOfficer
            ? {
                role: 'bot',
                text: 'Two reports are due this week: SR-1041 (Water supply, Day 6 of 7) and SR-1056 (Ration card, Day 5). Resolving them today keeps your block on track. ⏰',
              }
            : {
                role: 'bot',
                text: 'Yes! With your rural residence and household income under ₹3L, you likely qualify for PM Awas Yojana. Your income certificate is already verified — the form takes about 8 minutes. 👇',
                schemeId: 'pmay',
              },
        )
      }, 1200)
    }, 2200)
  }

  useEffect(() => {
    const timers = timersRef.current
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [])

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    scrollRef.current?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'end',
    })
  }, [messages, typing])

  return (
    <div>
      <PageHeader
        title="Sahayak chat"
        subtitle={
          isOfficer
            ? 'Your desk assistant — ask about pending reports, applications to review, or deadlines. In your language, by text or voice.'
            : 'Ask anything in your own language — by text or voice. No jargon, no forms-speak.'
        }
      />

      {/* Language switcher */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => switchLanguage(lang.id)}
            aria-pressed={language === lang.id}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
              language === lang.id
                ? 'bg-brand-navy text-navy-contrast shadow-soft'
                : 'border border-border-subtle bg-surface text-ink-700 hover:text-ink-900'
            }`}
          >
            {lang.label}
          </button>
        ))}
        <span className="ml-auto hidden text-xs text-ink-400 sm:block">
          Voice supported · replies read aloud
        </span>
      </div>

      {/* Chat card */}
      <div className="mt-4 flex flex-col rounded-[24px] border border-border-subtle bg-surface shadow-soft">
        <div className="flex h-[460px] flex-col gap-4 overflow-y-auto p-5 sm:p-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOfficer={isOfficer}
            />
          ))}
          {typing && (
            <div className="bubble-pop">
              <TypingBubble />
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 border-t border-border-subtle px-5 py-3 sm:px-6">
          {(isOfficer ? officerQuickReplies : quickReplies).map((reply) => (
            <button
              key={reply}
              onClick={() => sendQuick(reply)}
              className="rounded-full border border-border-subtle bg-canvas/60 px-3.5 py-1.5 text-xs font-medium text-ink-700 transition-colors duration-150 hover:border-brand-orange/60 hover:text-ink-900 focus-visible:outline-2 focus-visible:outline-brand-orange"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="border-t border-border-subtle p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-[20px] border border-border-subtle bg-canvas/50 p-1.5">
            <button
              onClick={startVoice}
              aria-label="Speak your question"
              className={`flex shrink-0 items-center justify-center rounded-[12px] p-3 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-brand-orange ${
                listening
                  ? 'bg-brand-orange text-white dark:text-[#16151b]'
                  : 'text-ink-700 hover:bg-surface'
              }`}
            >
              <Mic className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder={
                listening ? 'Listening… speak now' : 'Type your question…'
              }
              aria-label="Your question"
              className="w-full min-w-0 flex-1 bg-transparent px-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
            <button
              onClick={send}
              aria-label="Send message"
              className="flex shrink-0 items-center justify-center gap-2 rounded-[14px] bg-brand-navy px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.04em] text-navy-contrast transition-colors duration-150 hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] focus-visible:outline-2 focus-visible:outline-brand-orange"
            >
              <Send className="h-4 w-4" strokeWidth={1.75} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
          {listening && (
            <p className="mt-2 flex items-center gap-2 text-xs text-ink-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-orange" />
              Listening in {LANG_NAMES[language]}… you can speak now
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({
  message,
  isOfficer,
}: {
  message: ChatMessage
  isOfficer: boolean
}) {
  const isUser = message.role === 'user'
  if (isUser) {
    return (
      <div data-msg-id={message.id} className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-brand-navy px-4 py-3 text-[15px] leading-relaxed text-navy-contrast sm:max-w-[70%]">
          {message.text}
        </p>
      </div>
    )
  }
  return (
    <div data-msg-id={message.id} className="flex max-w-[88%] flex-col sm:max-w-[75%]">
      <div className="flex items-start gap-3">
        <BotAvatar />
        <p className="rounded-2xl rounded-bl-md border border-border-subtle bg-canvas/60 px-4 py-3 text-[15px] leading-relaxed text-ink-900">
          {message.text}
        </p>
      </div>
      {message.schemeId && (
        <div data-scheme-card className="ml-11 mt-2">
          <SchemeSuggestion schemeId={message.schemeId} isOfficer={isOfficer} />
        </div>
      )}
    </div>
  )
}

function BotAvatar() {
  return (
    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-navy dark:bg-[#16151b]">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 text-brand-orange"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M12 12 m-4 0 a4 4 0 1 1 8 0 a6 6 0 1 1 -12 0 a8 8 0 1 1 16 0" />
      </svg>
    </span>
  )
}

function SchemeSuggestion({
  schemeId,
  isOfficer,
}: {
  schemeId: string
  isOfficer: boolean
}) {
  const scheme = catalogSchemes.find((s) => s.id === schemeId)
  if (!scheme) return null
  return (
    <div className="w-72 rounded-2xl border border-border-subtle bg-surface p-4 shadow-soft">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-brand-mint" />
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">
          {scheme.category}
        </p>
        <span className="ml-auto rounded-full bg-brand-mint/20 px-2 py-0.5 text-[10px] font-semibold text-[#3d7d6b] dark:text-[#7fd1bb]">
          {isOfficer ? 'In your block ✓' : 'Documents verified ✓'}
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-ink-900">
        {scheme.title}
      </p>
      <p className="mt-0.5 text-xs font-medium text-brand-orange">
        {scheme.benefit}
      </p>
      <button className="mt-3 w-full rounded-[12px] bg-brand-navy px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-navy-contrast transition-colors duration-150 hover:bg-[#2d2839] dark:hover:bg-[#d9d5cd] focus-visible:outline-2 focus-visible:outline-brand-orange">
        {isOfficer ? 'Review applications' : 'Open application'}
      </button>
    </div>
  )
}

function TypingBubble() {
  return (
    <div className="flex items-center gap-3">
      <BotAvatar />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border-subtle bg-canvas/60 px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
