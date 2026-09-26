type Status = 'open' | 'full' | 'past' | 'cancelled'

const COPY: Record<Status, string> = {
  open: 'Open',
  full: 'Full',
  past: 'Past',
  cancelled: 'Cancelled',
}

const COLORS: Record<Status, { bg: string; fg: string }> = {
  open: { bg: 'rgba(22, 163, 74, 0.12)', fg: '#16a34a' },
  full: { bg: 'rgba(220, 38, 38, 0.12)', fg: '#dc2626' },
  past: { bg: 'var(--muted)', fg: 'var(--muted-foreground)' },
  cancelled: { bg: 'rgba(220, 38, 38, 0.12)', fg: '#dc2626' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { bg, fg } = COLORS[status]
  return (
    <span
      className={`event-status event-status--${status}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '11.5px',
        fontWeight: 700,
        padding: '3px 9px',
        borderRadius: '999px',
        background: bg,
        color: fg,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {COPY[status]}
    </span>
  )
}
