import { useState } from 'react'
import { unlockAudio } from '../engine/audioManager'

const GENRES = ['Fantasy', 'Horror', 'Sci-Fi', 'Western', 'Noir', 'Post-Apocalyptic', 'Isekai', 'Pirate', 'Alien Invasion', 'Lovecraftian', 'Dreams']
const TONES  = ['Grim', 'Heroic', 'Comedic', 'Mysterious', 'Tense', 'Melancholic']

export default function SetupScreen({ navigate, setConfig }) {
  const [genre, setGenre]         = useState(null)
  const [tone, setTone]           = useState(null)
  const [protagonist, setProtagonist] = useState('')

  const ready = genre && tone && protagonist.trim().length > 0

  const handleBegin = () => {
    unlockAudio()
    setConfig({ genre, tone, protagonist: protagonist.trim() })
    navigate('game')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
    }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(36px, 8vw, 64px)',
          color: 'var(--green)',
          letterSpacing: 6,
          lineHeight: 1,
          marginBottom: 8,
          textShadow: '0 0 20px var(--green)',
          animation: 'flicker 8s infinite',
        }}>
          CHRONICLES
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          color: 'var(--text-dim)',
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          AI Narrative Engine v1.0 // Configure your session
        </div>
      </div>

      {/* Card */}
      <div className="terminal-border" style={{
        width: '100%',
        maxWidth: 580,
        background: 'var(--bg-panel)',
        padding: 'clamp(16px, 3vw, 32px)',
      }}>

        {/* Genre */}
        <Section label="01 // SELECT GENRE">
          <OptionRow
            options={GENRES}
            selected={genre}
            onSelect={setGenre}
          />
        </Section>

        {/* Tone */}
        <Section label="02 // SELECT TONE">
          <OptionRow
            options={TONES}
            selected={tone}
            onSelect={setTone}
          />
        </Section>

        {/* Protagonist */}
        <Section label="03 // PROTAGONIST NAME" last>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--green-dim)' }}>&gt;</span>
            <input
              type="text"
              value={protagonist}
              onChange={e => setProtagonist(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && ready && handleBegin()}
              maxLength={32}
              placeholder="Enter name..."
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--border-bright)',
                outline: 'none',
                color: 'var(--green)',
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                padding: '4px 8px',
                width: '100%',
                caretColor: 'var(--green)',
              }}
            />
            <span className="blink" style={{ color: 'var(--green)' }}>█</span>
          </div>
        </Section>

        {/* Begin */}
        <button
          onClick={handleBegin}
          disabled={!ready}
          style={{
            width: '100%',
            marginTop: 28,
            padding: '14px',
            background: ready ? 'var(--green-dark)' : 'transparent',
            border: `1px solid ${ready ? 'var(--green)' : 'var(--border)'}`,
            color: ready ? 'var(--green)' : 'var(--text-dim)',
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            letterSpacing: 4,
            cursor: ready ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { if (ready) e.target.style.background = '#005c1a' }}
          onMouseLeave={e => { if (ready) e.target.style.background = 'var(--green-dark)' }}
        >
          {ready ? 'INITIALIZE STORY >' : 'AWAITING INPUT...'}
        </button>

      </div>

      {/* Footer */}
      <div style={{
        marginTop: 24,
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: 2,
        textAlign: 'center',
      }}>
        [ SHELF ] &nbsp;—&nbsp;
        <span
          onClick={() => navigate('shelf')}
          style={{ color: 'var(--green-dim)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          VIEW SAVED STORIES
        </span>
      </div>

    </div>
  )
}

/* ── small helpers ── */

function Section({ label, children, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 28 }}>
      <div style={{
        fontSize: 11,
        letterSpacing: 3,
        color: 'var(--text-dim)',
        marginBottom: 12,
        textTransform: 'uppercase',
      }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function OptionRow({ options, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(opt => {
        const active = selected === opt
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            style={{
              padding: '5px 10px',
              background: active ? 'var(--green-dark)' : 'transparent',
              border: `1px solid ${active ? 'var(--green)' : 'var(--border)'}`,
              color: active ? 'var(--green)' : 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: 'clamp(11px, 1.5vw, 13px)',
              cursor: 'pointer',
              letterSpacing: 1,
              transition: 'all 0.15s',
              borderRadius: 2,
            }}
          >
            {active ? `[${opt}]` : opt}
          </button>
        )
      })}
    </div>
  )
}