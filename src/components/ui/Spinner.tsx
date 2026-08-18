export function Spinner({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10) }}
      className={`animate-spin rounded-full border-brand-600 border-t-transparent ${className}`}
    />
  )
}

export function BrandSplash({ label }: { label?: string }) {
  return (
    <div className="flex h-full min-h-[50vh] w-full flex-col items-center justify-center gap-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-neutral-50 dark:bg-neutral-800 shadow-sm">
        <LogoMark size={56} />
      </div>
      {label && <p className="text-sm text-neutral-500 dark:text-neutral-400">{label}</p>}
    </div>
  )
}

export function LogoMark({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Cohort"
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
      draggable={false}
    />
  )
}
