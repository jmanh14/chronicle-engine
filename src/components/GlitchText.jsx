import { useState, useEffect, useRef, memo } from 'react'

const CHARS = 'A8#$%X@!?01&*ZK9>|/\\[]{}~'

function scramble(target, progress) {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ' || char === '\n') return char
      const threshold = i / target.length
      if (progress > threshold) return char
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join('')
}

const GlitchText = memo(function GlitchText({ text, sentenceTimes, currentTime }) {
  const [displayed, setDisplayed] = useState('')
  const progressRef = useRef(0)
  const frameRef    = useRef(null)

  useEffect(() => {
    if (!text) return
    progressRef.current = 0

    const duration = 1800
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
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [text])

  const currentSentenceIndex = sentenceTimes
    ? sentenceTimes.findIndex(s => currentTime >= s.startTime && currentTime < s.endTime)
    : -1

  if (displayed !== text) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 15,
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
        color: 'var(--text)',
      }}>
        {displayed}
      </div>
    )
  }

  if (sentenceTimes && sentenceTimes.length > 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 15,
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap',
      }}>
        {sentenceTimes.map((sentence, i) => (
          <span
            key={i}
            style={{
              color: i === currentSentenceIndex ? 'var(--green)' : 'var(--text)',
              background: i === currentSentenceIndex ? 'rgba(0, 255, 65, 0.08)' : 'transparent',
              borderRadius: 2,
              transition: 'color 0.15s, background 0.15s',
            }}
          >
            {sentence.text}{' '}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 15,
      lineHeight: 1.8,
      whiteSpace: 'pre-wrap',
      color: 'var(--text)',
    }}>
      {displayed}
    </div>
  )
}, (prev, next) => {
  const prevIndex = prev.sentenceTimes?.findIndex(
    s => prev.currentTime >= s.startTime && prev.currentTime < s.endTime
  ) ?? -1
  const nextIndex = next.sentenceTimes?.findIndex(
    s => next.currentTime >= s.startTime && next.currentTime < s.endTime
  ) ?? -1
  return prev.text === next.text && prevIndex === nextIndex
})

export default GlitchText