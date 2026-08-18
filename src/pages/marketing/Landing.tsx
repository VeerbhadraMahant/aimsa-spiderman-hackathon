import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Moon, Sun, Eye, TrendingUp, Home, Heart, Users, MessageCircle, Zap, MapPin, Calendar, User } from 'lucide-react'
import { LogoMark } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/contexts/ThemeContext'
import { DecorativeFigure } from '@/components/shell/DecorativeFigure'
import { FloatingArt } from '@/components/decor/FloatingArt'
import LiquidEther from '@/components/reactbits/LiquidEther'
import LogoLoop, { type LogoItem } from '@/components/reactbits/LogoLoop'
import CurvedLoop from '@/components/reactbits/CurvedLoop'
import { bumpAndGetViewCount, subscribeToViewCount } from '@/lib/liveCounter'

const communities = ['OWASP', 'GDGC', 'ACM', 'LFDT', 'IOT Club', 'Geeks For Geeks', 'AIMSA', 'ISR', 'NSS', 'Art Circle']

const communityLogos: LogoItem[] = communities.map((name) => ({
  node: (
    <span className="flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-2 text-sm font-semibold text-neutral-600 dark:text-neutral-300">
      {name}
    </span>
  ),
  title: name,
  ariaLabel: name,
}))

const features = [
  { icon: Home, title: 'Home Feed', body: 'Stay updated with a personalized feed of posts, announcements, and discussions from your subscribed communities and friends across campus.' },
  { icon: Heart, title: 'Communities', body: 'Discover and join 30+ student-run clubs and organizations at PCCOE — from OWASP and GDGC to Art Circle and NSS.' },
  { icon: Users, title: 'Friends', body: 'Build your campus network by adding friends, viewing their activity, and staying connected through shared communities.' },
  { icon: MessageCircle, title: 'Connect', body: 'Real-time encrypted messaging with end-to-end privacy. Chat one-on-one or in group conversations with fellow students.' },
  { icon: Zap, title: 'XD (Exchange)', body: 'An anonymous exchange board where students share honest thoughts, campus tips, and creative ideas freely.' },
  { icon: MapPin, title: 'Campus Maps', body: 'Interactive 3D campus navigation powered by TomTom — find classrooms, labs, cafeterias, and event venues instantly.' },
  { icon: Calendar, title: 'Academic Calendar', body: 'Never miss an exam, holiday, or submission deadline. Sync your academic schedule and get timely reminders.' },
  { icon: User, title: 'Student Profile', body: 'Showcase your achievements, certifications, and hackathon wins. Build a professional portfolio visible to peers and faculty.' },
]

const LIGHT_ETHER_COLORS = ['#FFFFFF', '#9CA3AF', '#F97316']
const DARK_ETHER_COLORS = ['#5227FF', '#FF9FFC', '#B497CF'] // React Bits default

export default function Landing() {
  const { theme, toggle } = useTheme()
  const [viewCount, setViewCount] = useState<number | null>(null)
  const [prevCount, setPrevCount] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    bumpAndGetViewCount().then((count) => {
      if (mounted) setViewCount(count)
    })
    const unsubscribe = subscribeToViewCount((count) => {
      setPrevCount((p) => (viewCount !== null ? viewCount : p))
      setViewCount(count)
    })
    return () => {
      mounted = false
      unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const delta = viewCount !== null && prevCount !== null ? viewCount - prevCount : null
  const bars = [40, 55, 48, 65, 60, 78, 72, 90, 85, 100]

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <FloatingArt variant="home" />
      <div className="relative z-10">
        <header className="sticky top-0 z-30 border-b border-neutral-100 dark:border-neutral-900 bg-white/80 dark:bg-neutral-950/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
            <div className="flex items-center gap-2">
              <LogoMark size={30} />
              <span className="text-lg font-extrabold">Cohort</span>
              <span className="hidden text-xs text-neutral-300 dark:text-neutral-600 sm:inline">PCCOE</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-900">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
              <Link to="/login">
                <Button variant="secondary" className="gap-2">
                  <GoogleIcon />
                  Sign in with Google
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <section className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-16 pt-16 sm:pt-24">
          <div className="pointer-events-none absolute inset-x-0 -top-8 bottom-0 z-0 opacity-70 dark:opacity-90">
            <LiquidEther
              colors={theme === 'dark' ? DARK_ETHER_COLORS : LIGHT_ETHER_COLORS}
              autoDemo
              autoSpeed={0.6}
              autoIntensity={3.5}
              mouseForce={30}
              cursorSize={140}
              resolution={0.5}
              className="h-full w-full"
            />
          </div>
          <DecorativeFigure variant={2} className="absolute bottom-0 left-0 z-0 h-40 w-40" />
          <DecorativeFigure variant={3} className="absolute right-4 top-24 z-0 h-32 w-32" />
          <div className="relative z-[1] grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-brand-600 sm:text-5xl lg:text-6xl">
                A Social Platform for PCCOE
              </h1>
              <p className="mt-6 max-w-md text-lg text-neutral-500 dark:text-neutral-400">
                Aggregate discussions, campus navigation, and encrypted messaging in real time. Monitor events and track
                opportunities—all without juggling multiple logins.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login">
                  <Button className="!bg-neutral-900 !text-white hover:!bg-neutral-800 dark:!bg-white dark:!text-neutral-900 px-6 py-3 text-base">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" className="px-6 py-3 text-base">
                    Explore platform
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm">
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xl backdrop-blur">
                <div className="flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-neutral-400">Total Project Views</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Eye size={20} className="text-brand-600" />
                    <span className="text-3xl font-extrabold tabular-nums">{(viewCount ?? 11461).toLocaleString()}</span>
                    {delta !== null && delta > 0 && (
                      <span className="ml-1 flex items-center gap-0.5 rounded-full bg-green-50 dark:bg-green-950 px-2 py-0.5 text-xs font-semibold text-green-600">
                        <TrendingUp size={12} /> +{delta}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                    Live — updating in realtime
                  </p>
                  <div className="mt-5 flex h-24 items-end gap-1.5">
                    {bars.map((h, i) => (
                      <div key={i} className="flex-1 rounded-t bg-brand-200 dark:bg-brand-800" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-4 border-y border-neutral-100 dark:border-neutral-900 bg-neutral-50/60 dark:bg-neutral-900/40 py-6">
          <div style={{ height: 56 }}>
            <LogoLoop
              logos={communityLogos}
              speed={60}
              direction="left"
              logoHeight={36}
              gap={16}
              fadeOut
              fadeOutColor={theme === 'dark' ? '#0b0b0f' : '#f9fafb'}
              ariaLabel="Cohort partner communities"
            />
          </div>
          <div className="max-h-32 overflow-hidden">
            <CurvedLoop
              marqueeText="COHORT SOCIAL ✦ CONNECT ✦ DISCOVER ✦ NAVIGATE ✦"
              speed={1.4}
              curveAmount={50}
              interactive={false}
              className="fill-brand-600"
            />
          </div>
        </div>

        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight">Explore Platform Features</h2>
            <p className="mt-3 text-neutral-500 dark:text-neutral-400">
              From encrypted messaging to real-time campus navigation, discover all the tools designed to empower your
              social experience.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 hover:shadow-md transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-900/40 text-brand-600">
                  <f.icon size={20} />
                </div>
                <h3 className="mt-4 font-bold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/60 dark:bg-neutral-900/40 px-6 py-20">
          <DecorativeFigure variant={1} className="absolute -right-4 bottom-0 h-48 w-48" />
          <div className="relative mx-auto max-w-3xl space-y-4 text-neutral-600 dark:text-neutral-300">
            <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">About Cohort PCCOE</h2>
            <p>
              Cohort is the official student platform for Pimpri Chinchwad College of Engineering, built by students,
              for students. With 350+ active users and growing, it aggregates 30+ communities across every department
              into a single, unified experience.
            </p>
            <p>
              Connect brings end-to-end encrypted messaging to campus, with disappearing messages for privacy-first
              conversations. XD (Exchange) is our anonymous board for honest thoughts, campus tips and creative ideas —
              no names attached.
            </p>
            <p>
              The interactive campus map, powered by TomTom, helps you find classrooms, labs, and cafeterias in
              seconds, while the academic calendar keeps exams, holidays, and deadlines in one place. Your profile
              becomes a living portfolio of achievements, certifications, and hackathon wins.
            </p>
            <p>
              Built with React, Supabase, and real-time WebSocket connections — Cohort is engineered to be fast,
              private, and genuinely useful. Your data stays yours; we built this for the community, not for ads.
            </p>
          </div>
        </section>

        <footer className="border-t border-neutral-100 dark:border-neutral-900 px-6 py-8 text-center text-sm text-neutral-400">
          © {new Date().getFullYear()} Cohort — A Social Platform for PCCOE. Not affiliated with PCCOE administration.
        </footer>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 34.9 26.8 36 24 36c-5.3 0-9.6-3.4-11.3-8.1l-6.5 5C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.5 36.4 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}
