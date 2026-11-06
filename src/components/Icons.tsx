interface IconProps {
  className?: string
  size?: number
}

const common = {
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function ArrowUpRight({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <path d="M6 14 14 6M7 6h7v7" />
    </svg>
  )
}

export function ArrowDown({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <path d="M10 4v12M5 11l5 5 5-5" />
    </svg>
  )
}

export function ArrowUp({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <path d="M10 16V4M5 9l5-5 5 5" />
    </svg>
  )
}

export function ChevronLeft({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <path d="m12 4-6 6 6 6" />
    </svg>
  )
}

export function ChevronRight({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <path d="m8 4 6 6-6 6" />
    </svg>
  )
}

export function PlayMark({ className, size }: IconProps) {
  return (
    <svg width={size ?? 22} height={size ?? 22} viewBox="0 0 22 22" fill="currentColor" aria-hidden="true" focusable={false} className={className}>
      <path d="M6 3.5v15l13-7.5z" />
    </svg>
  )
}

export function MailIcon({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 20} height={size ?? 20} className={className}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" />
      <path d="m3 5.5 7 5 7-5" />
    </svg>
  )
}

export function WhatsAppIcon({ className, size }: IconProps) {
  return (
    <svg
      width={size ?? 22}
      height={size ?? 22}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable={false}
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.414z" />
    </svg>
  )
}

export function CopyIcon({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 18} height={size ?? 18} className={className}>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M3 13V4.5A1.5 1.5 0 0 1 4.5 3H13" />
    </svg>
  )
}

export function CheckIcon({ className, size }: IconProps) {
  return (
    <svg {...common} width={size ?? 18} height={size ?? 18} className={className}>
      <path d="m4 10.5 4 4 8-9" />
    </svg>
  )
}
