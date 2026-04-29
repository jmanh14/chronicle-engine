import { useRef, useEffect } from 'react'

const SECTIONS = [
  { key: 'items',   label: 'ITEMS',   icon: '◈' },
  { key: 'allies',  label: 'ALLIES',  icon: '◉' },
  { key: 'enemies', label: 'ENEMIES', icon: '◆' },
  { key: 'status',  label: 'STATUS',  icon: '◎' },
]

export default function InventoryPanel({ inventory, turn, protagonist }) {
  const prevRef    = useRef({})
  const newEntries = useRef(new Set())

  useEffect(() => {
    const prev = prevRef.current
    const fresh = new Set()

    const isFirstLoad = Object.values(prev).every(arr => arr.length === 0)

    if (!isFirstLoad) {
      SECTIONS.forEach(({ key }) => {
        const prevList = prev[key] ?? []
        const currList = inventory?.[key] ?? []
        currList.forEach(entry => {
          if (!prevList.includes(entry)) fresh.add(entry)
        })
      })
    }

    newEntries.current = fresh
    prevRef.current = JSON.parse(JSON.stringify(inventory ?? {}))
  }, [inventory])

  return (
    <div style={{
      background: 'var(--bg-panel)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
    }}>

      {/* Fixed panel header */}
      <div style={{
        padding: '12px 10px 10px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(14px, 2vw, 20px)',
          color: 'var(--green)',
          letterSpacing: 3,
        }}>
          DOSSIER
        </div>
        <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: 'var(--text-dim)', letterSpacing: 2, marginTop: 4 }}>
          {protagonist} // T-{String(turn).padStart(2, '0')}
        </div>
      </div>

      {/* Scrollable inventory entries */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        WebkitOverflowScrolling: 'touch',
      }}>
        {SECTIONS.map(({ key, label, icon }) => {
          const entries = inventory?.[key] ?? []
          return (
            <div key={key}>
              <div style={{
                fontSize: 'clamp(9px, 1.2vw, 10px)',
                letterSpacing: 3,
                color: 'var(--text-dim)',
                marginBottom: 6,
                textTransform: 'uppercase',
              }}>
                {icon} {label}
              </div>
              {entries.length === 0 ? (
                <div style={{ fontSize: 'clamp(10px, 1.5vw, 12px)', color: 'var(--border-bright)', opacity: 0.3, paddingLeft: 4 }}>
                  — NONE —
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {entries.map((entry, i) => {
                    const isNew = newEntries.current.has(entry)
                    return (
                      <div key={i} style={{
                        fontSize: 'clamp(10px, 1.5vw, 12px)',
                        color: key === 'enemies' ? 'var(--red)' : key === 'allies' ? 'var(--amber)' : 'var(--text)',
                        paddingLeft: 4,
                        borderLeft: `2px solid ${
                          key === 'enemies' ? 'var(--red)'
                          : key === 'allies' ? 'var(--amber)'
                          : 'var(--green-dark)'
                        }`,
                        lineHeight: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                      }}>
                        <span>{entry}</span>
                        {isNew && (
                          <span style={{
                            fontSize: 9,
                            letterSpacing: 2,
                            color: 'var(--bg)',
                            background: 'var(--green)',
                            padding: '1px 5px',
                            flexShrink: 0,
                          }}>
                            NEW
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}