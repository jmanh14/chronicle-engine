import { useState, useEffect, useRef } from 'react'

export default function BootSequence({ config, onComplete, beatReady }) {
  const [lines, setLines]       = useState([])
  const [animDone, setAnimDone] = useState(false)
  const [done, setDone]         = useState(false)
  const hasRun                  = useRef(false)

  const SIGNAL_ACQUIRED = { text: 'SIGNAL ACQUIRED. READY TO TRANSMIT.', highlight: true }

  const BOOT_LINES_INITIAL = [
    { text: 'CHRONICLE ENGINE v1.0 — INITIALIZING...', delay: 0 },
    { text: 'LOADING NARRATIVE CORE...', delay: 600 },
    { text: `GENRE DETECTED: ${config.genre.toUpperCase()}`, delay: 1100 },
    { text: `TONE CALIBRATED: ${config.tone.toUpperCase()}`, delay: 1500 },
    { text: `PROTAGONIST IDENTIFIED: ${config.protagonist.toUpperCase()}`, delay: 1900 },
    { text: 'ESTABLISHING STORY THREAD...', delay: 2400 },
    { text: 'AWAITING NARRATIVE SIGNAL...', delay: 2900, amber: true },
  ]

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    BOOT_LINES_INITIAL.forEach(({ text, delay, amber }) => {
      setTimeout(() => {
        setLines(prev => [...prev, { text, amber }])
      }, delay)
    })
    setTimeout(() => setAnimDone(true), 2900)
  }, [])

  useEffect(() => {
    if (animDone && beatReady && !done) {
      setLines(prev => [...prev, SIGNAL_ACQUIRED])
      setTimeout(() => {
        setDone(true)
        setTimeout(onComplete, 400)
      }, 1200)
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
        {lines.map((line, i) => {
          const isAmberActive     = line.amber && !beatReady
          const isAmberDone       = line.amber && beatReady
          const isHighlightActive = line.highlight && beatReady

          let color = 'var(--text-dim)'
          let glow  = 'none'

          if (isAmberActive) {
            color = 'var(--amber)'
          } else if (isAmberDone || isHighlightActive) {
            color = 'var(--green)'
            glow  = '0 0 10px var(--green)'
          }

          return (
            <div
              key={i}
              className="scanin"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                letterSpacing: 2,
                color,
                textShadow: glow,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                transition: 'color 0.4s ease, text-shadow 0.4s ease',
              }}
            >
              <span style={{ color: isAmberActive ? 'var(--amber)' : 'var(--green-dim)' }}>
                &gt;
              </span>
              {line.text}
              {isAmberActive && (
                <span className="blink" style={{ color: 'var(--amber)' }}>█</span>
              )}
              {!line.amber && !line.highlight && i === lines.length - 1 && !animDone && (
                <span className="blink" style={{ color: 'var(--green)' }}>█</span>
              )}
            </div>
          )
        })}
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
          background: beatReady ? 'var(--green)' : 'var(--amber)',
          boxShadow: `0 0 8px ${beatReady ? 'var(--green)' : 'var(--amber)'}`,
          animation: 'growBar 3.4s linear forwards',
          transition: 'background 0.4s ease, box-shadow 0.4s ease',
        }} />
      </div>

    </div>
  )
}