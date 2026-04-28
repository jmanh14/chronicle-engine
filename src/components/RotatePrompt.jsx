import { useState, useEffect } from 'react'

export default function RotatePrompt() {
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    function check() {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 768
      setIsPortrait(portrait)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (!isPortrait) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--bg)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
    }}>
      <div style={{
        fontSize: 48,
        animation: 'rotateIcon 2s ease-in-out infinite',
      }}>
        ⟳
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 28,
        color: 'var(--green)',
        letterSpacing: 4,
        textAlign: 'center',
      }}>
        ROTATE DEVICE
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-dim)',
        letterSpacing: 2,
        textAlign: 'center',
        maxWidth: 240,
        lineHeight: 1.8,
      }}>
        CHRONICLES is best experienced in landscape mode
      </div>
    </div>
  )
}