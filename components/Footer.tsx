export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1.5px solid var(--line)',
        marginTop: 64,
        padding: '24px 0',
      }}
    >
      <div
        className="shell"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8,
          fontSize: 13,
          color: 'var(--ink-soft)',
        }}
      >
        <span>Campus Connect </span>

      </div>
    </footer>
  )
}
