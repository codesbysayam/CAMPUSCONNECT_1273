import { ReactNode } from 'react'

export default function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div
      className="card-surface"
      style={{
        padding: '48px 32px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
          stroke="var(--ink-soft)"
          strokeWidth="1.4"
        />
        <path d="M15 4v5h5" stroke="var(--ink-soft)" strokeWidth="1.4" />
        <path d="M8 13h8M8 17h5" stroke="var(--ink-soft)" strokeWidth="1.4" />
      </svg>
      <h3 style={{ fontSize: 18 }}>{title}</h3>
      <p style={{ maxWidth: 360 }}>{description}</p>
      {action}
    </div>
  )
}
