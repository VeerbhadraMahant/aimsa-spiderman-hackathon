import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, MapPin, Sparkles } from 'lucide-react'
import { LogoMark, Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/contexts/AuthContext'
import { seedUsers, DEMO_PERSONAS } from '@/lib/seed/users'

const highlights = [
  { icon: ShieldCheck, label: 'End-to-end encrypted Connect' },
  { icon: Users, label: '30+ campus communities' },
  { icon: MapPin, label: 'Live interactive campus map' },
]

export default function Login() {
  const { user, loading, isDemoMode, signInWithGoogle, signInDemo } = useAuth()
  const navigate = useNavigate()
  const [signingIn, setSigningIn] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [loading, user, navigate])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="rounded-2xl bg-white dark:bg-neutral-900 p-10 shadow-sm">
          <LogoMark size={80} />
        </div>
      </div>
    )
  }

  const personas = seedUsers.filter((u) => DEMO_PERSONAS.includes(u.id))

  async function pick(id: string) {
    setSigningIn(id)
    await signInDemo(id)
    navigate('/dashboard')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-50 px-6 py-16 dark:bg-neutral-950">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-400/30 via-pink-300/20 to-amber-300/20 blur-3xl dark:from-brand-600/20 dark:via-pink-500/10 dark:to-amber-500/10" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 px-8 pb-2 pt-9">
            <div className="rounded-2xl bg-gradient-to-br from-brand-50 to-pink-50 dark:from-brand-900/30 dark:to-pink-900/20 p-3 shadow-sm">
              <LogoMark size={48} />
            </div>
            <h1 className="text-xl font-extrabold">Sign in to Cohort</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">A Social Platform for PCCOE</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 px-8 py-5">
            {highlights.map((h) => (
              <span
                key={h.label}
                className="flex items-center gap-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 px-3 py-1 text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                <h.icon size={12} className="text-brand-500" />
                {h.label}
              </span>
            ))}
          </div>

          <div className="px-8 pb-9">
            {!isDemoMode ? (
              <Button variant="secondary" onClick={signInWithGoogle} className="w-full gap-2 py-3 text-base shadow-sm">
                <GoogleIcon />
                Sign in with Google
              </Button>
            ) : (
              <div>
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs text-amber-700 dark:text-amber-300">
                  <Sparkles size={14} className="shrink-0" />
                  Demo mode — Google sign-in isn't configured yet. Pick a demo student below to explore Cohort.
                </div>
                <div className="space-y-2">
                  {personas.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => pick(p.id)}
                      disabled={!!signingIn}
                      className="group flex w-full items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3.5 py-3 text-left transition hover:-translate-y-0.5 hover:border-brand-400 hover:bg-brand-50/50 hover:shadow-md dark:hover:bg-brand-900/20 disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      <Avatar name={p.displayName} size={38} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{p.displayName}</p>
                        <p className="truncate text-xs text-neutral-400">
                          @{p.handle} · {p.department}
                        </p>
                      </div>
                      {signingIn === p.id ? (
                        <Spinner size={16} className="shrink-0" />
                      ) : (
                        <span className="shrink-0 text-xs font-semibold text-brand-500 opacity-0 transition group-hover:opacity-100">
                          Continue →
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-neutral-400">
          By continuing you agree this is a student hackathon project, not affiliated with PCCOE administration.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.4 4.4-17.7 10.7z" />
      <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 34.9 26.8 36 24 36c-5.3 0-9.6-3.4-11.3-8.1l-6.5 5C9.5 39.5 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.3 5.3C40.5 36.4 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  )
}
