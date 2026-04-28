import { useState, useEffect, useRef } from 'react'

export default function BootSequence({ config, onComplete, beatReady }) {
  const [lines, setLines]       = useState([])
  const [animDone, setAnimDone] = useState(false)
  const [done, setDone]         = useState(false)
  const hasRun                  = useRef(false)

  const BOOT_LINES = [
    { text: 'CHRONICLE ENGINE v1.0 — INITIALIZING...', delay: 0 },
    { text: 'LOADING NARRATIVE CORE...', delay: 600 },
    { text: `GENRE DETECTED: ${config.genre.toUpperCase()}`, delay: 1100 },
    { text: `TONE CALIBRATED: ${config.tone.toUpperCase()}`, delay: 1500 },
    { text: `PROTAGONIST IDENTIFIED: ${config.protagonist.toUpperCase()}`, delay: 1900 },
    { text: 'ESTABLISHING STORY THREAD...', delay: 2400 },
    { text: 'AWAITING NARRATIVE SIGNAL...', delay: 2900 },
    { text: 'SIGNAL ACQUIRED. READY TO TRANSMIT.', delay: 3400, highlight: true },
  ]

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    BOOT_LINES.forEach(({ text, delay, highlight }) => {
      setTimeout(() => {
        setLines(prev => [...prev, { text, highlight }])
      }, delay)
    })
    setTimeout(() => setAnimDone(true), 3400)
  }, [])

  useEffect(() => {
    if (animDone && beatReady && !done) {
      setDone(true)
      setTimeout(onComplete, 1200)
    }
  }, [animDone, beatReady])

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '10vw',
      zIndex: 100,
      opacity: done ? 0 : 1,
      transition: 'opacity 0.4s ease',
    }}>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 13,
        letterSpacing: 6,
        color: 'var(--text-dim)',
        marginBottom: 32,
        textTransform: 'uppercase',
      }}>
        // System Boot
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {lines.map((line, i) => (
          <div
            key={i}
            className="scanin"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 15,
              letterSpacing: 2,
              color: line.highlight ? 'var(--green)' : 'var(--text-dim)',
              textShadow: line.highlight ? '0 0 10px var(--green)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ color: 'var(--green-dim)' }}>&gt;</span>
            {line.text}
            {i === lines.length - 1 && !animDone && (
              <span className="blink" style={{ color: 'var(--green)' }}>█</span>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 40,
        width: '100%',
        maxWidth: 400,
        height: 2,
        background: 'var(--border)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--green)',
          boxShadow: '0 0 8px var(--green)',
          animation: 'growBar 3.4s linear forwards',
        }} />
      </div>

    </div>
  )
}