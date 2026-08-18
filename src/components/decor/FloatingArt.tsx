import { useMemo, type CSSProperties } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

type Variant = 'home' | 'dashboard'

interface SlotDef {
  key: string
  base: CSSProperties
}

// Base anchor points, viewport-relative (position: fixed).
const HOME_SLOTS: SlotDef[] = [
  { key: 'left-mid', base: { left: 20, top: '50%' } },
  { key: 'left-mid-below', base: { left: 20, top: 'calc(50% + 40px)' } },
  { key: 'right-upper', base: { right: 20, top: 'calc(50% - 60px)' } },
  { key: 'right-bottom', base: { right: 20, bottom: 28 } },
]

const DASHBOARD_EXTRA_SLOTS: SlotDef[] = [
  { key: 'top-left', base: { left: 20, top: 16 } },
  { key: 'top-right', base: { right: 20, top: 16 } },
]

// Home screen: only 3 dark-mode images exist, so the "left-mid-below" slot
// is intentionally skipped in dark mode (light mode fills all 4).
const HOME_IMAGES = {
  dark: ['/decor/black-1.png', undefined, '/decor/black-4.png', '/decor/black-5.png'],
  light: ['/decor/white-1.png', '/decor/white-2.png', '/decor/white-3.png', '/decor/white-6.png'],
}

// Whatever wasn't used on the home screen, per mode.
const DASHBOARD_EXTRA_IMAGES = {
  dark: ['/decor/black-2.png', '/decor/black-3.png'],
  light: ['/decor/white-4.png', '/decor/white-5.png'],
}

function useJitter(count: number) {
  // Computed once per mount so images don't jump around on re-render.
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        dx: Math.round((Math.random() - 0.5) * 70), // -35..+35
        dy: Math.round((Math.random() - 0.5) * 70),
        size: 22 + Math.round(Math.random() * 8), // 22..30px
        rotate: Math.round((Math.random() - 0.5) * 16), // -8..8deg
        duration: 5 + Math.random() * 3, // 5..8s bob cycle
        delay: Math.random() * -6, // negative = start mid-cycle, avoids synced bobbing
      })),
    [count],
  )
}

export function FloatingArt({ variant }: { variant: Variant }) {
  const { theme } = useTheme()
  const mode = theme === 'dark' ? 'dark' : 'light'

  const slots = variant === 'dashboard' ? [...HOME_SLOTS, ...DASHBOARD_EXTRA_SLOTS] : HOME_SLOTS
  const images =
    variant === 'dashboard'
      ? [...HOME_IMAGES[mode], ...DASHBOARD_EXTRA_IMAGES[mode]]
      : HOME_IMAGES[mode]

  const jitters = useJitter(slots.length)

  // On the dashboard the icon rail / right sidebar are opaque and sit exactly
  // where the edge slots are anchored, so decor needs to render above that
  // chrome to be visible at all (still non-interactive, so nothing is blocked).
  return (
    <div aria-hidden className={`pointer-events-none fixed inset-0 overflow-hidden ${variant === 'dashboard' ? 'z-20' : 'z-0'}`}>
      {slots.map((slot, i) => {
        const src = images[i]
        if (!src) return null
        const j = jitters[i]
        const centering = slot.base.top === '50%' ? 'translateY(-50%) ' : ''
        const style: CSSProperties = {
          ...slot.base,
          position: 'fixed',
          width: j.size,
          height: j.size,
          transform: `${centering}translate(${j.dx}px, ${j.dy}px) rotate(${j.rotate}deg)`,
          animationDuration: `${j.duration}s`,
          animationDelay: `${j.delay}s`,
        }
        return (
          <img
            key={slot.key}
            src={src}
            alt=""
            className="decor-float select-none object-contain opacity-90 drop-shadow-md"
            style={style}
            draggable={false}
          />
        )
      })}
    </div>
  )
}
