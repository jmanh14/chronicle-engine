import { useState, useEffect } from 'react'

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

export default function MovieCard({ card, animate = false }) {
  const [step, setStep] = useState(animate ? 0 : 99)

  useEffect(() => {
    if (!animate) return
    const timings = [300, 800, 1400, 1900, 2400, 2900]
    const timers = timings.map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [animate])

  const outcomeColor = OUTCOME_COLORS[card.outcome] ?? 'var(--text-dim)'

  const show = (n) => step >= n

  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: '1px solid var(--border-bright)',
      padding: '28px',
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
        opacity: show(1) ? 1 : 0,
        transform: show(1) ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s ease',
      }}>
        <span>{card.genre?.toUpperCase()} // {card.tone?.toUpperCase()}</span>
        <span>{card.rating}</span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(24px, 4vw, 36px)',
        color: 'var(--green)',
        letterSpacing: 3,
        lineHeight: 1.1,
        marginBottom: 8,
        textShadow: show(2) ? '0 0 12px var(--green)' : 'none',
        opacity: show(2) ? 1 : 0,
        transform: show(2) ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.6s ease',
        filter: show(2) ? 'none' : 'blur(4px)',
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
        opacity: show(3) ? 1 : 0,
        transform: show(3) ? 'translateY(0)' : 'translateY(6px)',
        transition: 'all 0.5s ease',
      }}>
        "{card.tagline}"
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'var(--border)',
        marginBottom: 20,
        transformOrigin: 'left',
        transform: show(3) ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.6s ease',
      }} />

      {/* Synopsis */}
      <div style={{
        fontSize: 13,
        lineHeight: 1.8,
        color: 'var(--text)',
        marginBottom: 24,
        opacity: show(4) ? 1 : 0,
        transform: show(4) ? 'translateY(0)' : 'translateY(6px)',
        transition: 'all 0.5s ease',
      }}>
        {card.synopsis}
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 12,
      }}>
        {[
          { label: 'PROTAGONIST', value: card.protagonist, color: null, index: 5 },
          { label: 'TURNS', value: card.turnsPlayed, color: null, index: 5 },
          { label: 'OUTCOME', value: card.outcome, color: outcomeColor, index: 6 },
        ].map(({ label, value, color, index }) => (
          <div
            key={label}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              padding: '10px 12px',
              opacity: show(index) ? 1 : 0,
              transform: show(index) ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
              transition: 'all 0.4s ease',
            }}
          >
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
              color: color ?? 'var(--green)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              wordBreak: 'break-word',
            }}>
              {value}
            </div>
          </div>
        ))}
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