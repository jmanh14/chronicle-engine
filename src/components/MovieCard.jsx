const OUTCOME_COLORS = {
  SURVIVED:   'var(--green)',
  TRIUMPHANT: 'var(--green)',
  ASCENDED:   'var(--green)',
  REDEEMED:   'var(--amber)',
  ESCAPED:    'var(--amber)',
  DEFEATED:   'var(--red)',
  PERISHED:   'var(--red)',
  LOST:       'var(--red)',
}

export default function MovieCard({ card }) {
  const outcomeColor = OUTCOME_COLORS[card.outcome] ?? 'var(--text-dim)'

  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-bright)',
      padding: '28px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Corner decorations */}
      <Corner pos={{ top: 6, left: 6 }} />
      <Corner pos={{ top: 6, right: 6 }} />
      <Corner pos={{ bottom: 6, left: 6 }} />
      <Corner pos={{ bottom: 6, right: 6 }} />

      {/* Genre / rating row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 20,
        fontSize: 11,
        letterSpacing: 3,
        color: 'var(--text-dim)',
      }}>
        <span>{card.genre?.toUpperCase()} // {card.tone?.toUpperCase()}</span>
        <span>{card.rating}</span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 36,
        color: 'var(--green)',
        letterSpacing: 3,
        lineHeight: 1.1,
        marginBottom: 8,
        textShadow: '0 0 12px var(--green)',
      }}>
        {card.title?.toUpperCase()}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 13,
        color: 'var(--text-dim)',
        fontStyle: 'italic',
        marginBottom: 20,
        letterSpacing: 1,
      }}>
        "{card.tagline}"
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'var(--border)',
        marginBottom: 20,
      }} />

      {/* Synopsis */}
      <div style={{
        fontSize: 13,
        lineHeight: 1.8,
        color: 'var(--text)',
        marginBottom: 24,
      }}>
        {card.synopsis}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
      }}>
        <Stat label="PROTAGONIST" value={card.protagonist} />
        <Stat label="TURNS" value={card.turnsPlayed} />
        <Stat
          label="OUTCOME"
          value={card.outcome}
          valueColor={outcomeColor}
        />
      </div>
    </div>
  )
}

function Stat({ label, value, valueColor }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      padding: '10px 12px',
    }}>
      <div style={{
        fontSize: 9,
        letterSpacing: 3,
        color: 'var(--text-dim)',
        marginBottom: 6,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 13,
        color: valueColor ?? 'var(--green)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        wordBreak: 'break-word',
      }}>
        {value}
      </div>
    </div>
  )
}

function Corner({ pos }) {
  return (
    <div style={{
      position: 'absolute',
      width: 10,
      height: 10,
      borderColor: 'var(--green-dim)',
      borderStyle: 'solid',
      borderWidth: 0,
      borderTopWidth: pos.top !== undefined ? 1 : 0,
      borderBottomWidth: pos.bottom !== undefined ? 1 : 0,
      borderLeftWidth: pos.left !== undefined ? 1 : 0,
      borderRightWidth: pos.right !== undefined ? 1 : 0,
      ...pos,
    }} />
  )
}