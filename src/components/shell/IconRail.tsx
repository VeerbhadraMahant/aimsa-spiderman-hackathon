import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { navItems } from './navItems'
import { LogoMark } from '@/components/ui/Spinner'
import { useTheme } from '@/contexts/ThemeContext'

export function IconRail() {
  const { theme, toggle } = useTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <nav
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
      className={`flex h-full shrink-0 flex-col items-stretch gap-1 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-4 transition-[width] duration-200 ease-out ${
        expanded ? 'w-52' : 'w-16'
      }`}
    >
      <NavLink
        to="/dashboard"
        onClick={(e) => e.stopPropagation()}
        className={`mb-3 flex h-9 items-center gap-2.5 ${expanded ? 'px-4' : 'justify-center'}`}
      >
        <LogoMark size={32} className="shrink-0" />
        {expanded && <span className="truncate font-extrabold">Cohort</span>}
      </NavLink>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            title={item.label}
            onClick={(e) => e.stopPropagation()}
            className={({ isActive }) =>
              `relative mx-2.5 flex h-10 items-center gap-3 rounded-xl transition ${expanded ? 'px-2.5' : 'w-10 justify-center'} ${
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`
            }
          >
            <item.icon size={20} strokeWidth={2} className="shrink-0" />
            {expanded && <span className="truncate text-sm font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggle()
        }}
        title="Toggle theme"
        className={`mx-2.5 flex h-10 items-center gap-3 rounded-xl text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
          expanded ? 'px-2.5' : 'w-10 justify-center'
        }`}
      >
        {theme === 'light' ? <Moon size={19} className="shrink-0" /> : <Sun size={19} className="shrink-0" />}
        {expanded && <span className="truncate text-sm font-medium">Toggle theme</span>}
      </button>
    </nav>
  )
}
