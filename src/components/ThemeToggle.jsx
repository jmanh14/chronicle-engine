import { useStore } from '../store'

const THEMES = ['green', 'amber', 'cyan', 'red', 'white', 'matrix']
const LABELS = {
  green:  'GRN',
  amber:  'AMB',
  cyan:   'CYN',
  red:    'RED',
  white:  'WHT',
  matrix: 'MTX',
}

export default function ThemeToggle() {
  const theme    = useStore(s => s.theme)
  const setTheme = useStore(s => s.setTheme)

  function cycleTheme() {
    const idx     = THEMES.indexOf(theme)
    const next    = THEMES[(idx + 1) % THEMES.length]
    setTheme(next)
  }

  return (
    <button
      onClick={cycleTheme}
      title="Change color theme"
      style={{
        background: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(9px, 1.2vw, 11px)',
        padding: '3px 8px',
        cursor: 'pointer',
        letterSpacing: 1,
        borderRadius: 2,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.target.style.borderColor = 'var(--green)'
        e.target.style.color = 'var(--green)'
      }}
      onMouseLeave={e => {
        e.target.style.borderColor = 'var(--border)'
        e.target.style.color = 'var(--text-dim)'
      }}
    >
      ◑ {LABELS[theme]}
    </button>
  )
}