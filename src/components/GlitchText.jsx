import { useState, useEffect, useRef } from 'react'

const CHARS = 'A8#$%X@!?01&*ZK9>|/\\[]{}~'

function scramble(target, progress) {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ' || char === '\n') return char
      const threshold = (i / target.length)
      if (progress > threshold) return char
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join('')
}

export default function GlitchText({ text, onDone, style }) {
  const [displayed, setDisplayed] = useState('')
  const progressRef = useRef(0)
  const frameRef    = useRef(null)

  useEffect(() => {
    if (!text) return
    progressRef.current = 0

    const duration = 1800 // ms to fully resolve
    const start = performance.now()

    function tick(now) {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      progressRef.current = progress

      setDisplayed(scramble(text, progress))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayed(text)
        onDone?.()
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text])

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      lineHeight: 1.8,
      whiteSpace: 'pre-wrap',
      color: 'var(--text)',
      ...style,
    }}>
      {displayed}
    </div>
  )
}