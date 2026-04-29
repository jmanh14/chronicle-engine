import { useState } from 'react'
import { unlockAudio } from '../engine/audioManager'

const GENRES = ['Fantasy', 'Horror', 'Sci-Fi', 'Western', 'Noir', 'Post-Apocalyptic', 'Isekai', 'Pirate', 'Alien Invasion', 'Lovecraftian', 'Dreams']
const TONES  = ['Grim', 'Heroic', 'Comedic', 'Mysterious', 'Tense', 'Melancholic']

export default function SetupScreen({ navigate, setConfig }) {
  const [genre, setGenre]         = useState(null)
  const [tone, setTone]           = useState(null)
  const [protagonist, setProtagonist] = useState('')
  const [useScenario, setUseScenario] = useState(false)
  const [scenario, setScenario] = useState('')

  const SCENARIO_LIMIT = 150

  const NAMES = [
    'Kael', 'Lyra', 'Doran', 'Seraphine', 'Vex', 'Mira', 'Theron', 'Zara',
    'Oryn', 'Nyx', 'Caden', 'Elara', 'Rook', 'Sable', 'Finn', 'Isolde',
    'Draven', 'Vera', 'Colt', 'Astrid', 'Jace', 'Nova', 'Silas', 'Wren',
    'Bram', 'Talia', 'Gideon', 'Rhea', 'Zephyr', 'Maris', 'Onyx', 'Celeste',
    'Reed', 'Vesper', 'Hawk', 'Freya', 'Omen', 'Lena', 'Cruz', 'Sylvie',
    'Dante', 'Iris', 'Corvin', 'Sage', 'Blaze', 'Nora', 'Griffon', 'Ada',
    'Valor', 'Petra', 'James', 'Marcus', 'Leon', 'Victor', 'Adrian', 'Ethan', 'Cole', 'Owen',
    'Dean', 'Miles', 'Roman', 'Seth', 'Grant', 'Reid', 'Nash', 'Troy',
    'Blake', 'Chase', 'Kane', 'Luke', 'Elena', 'Sara', 'Maya', 'Claire', 'Diana', 'Rose', 'Jade', 'Kate',
    'Anna', 'Leah', 'Grace', 'Quinn', 'Hope', 'Dawn', 'Faith', 'Skye',
    'Brooke', 'Paige', 'Hazel', 'Eve', 'Alex', 'Jordan', 'Morgan', 'River', 'Avery', 'Casey', 'Drew', 'Jamie',
    'Parker', 'Reese', 'Riley', 'Rowan', 'Sam', 'Taylor', 'Charlie'
  ]

  function randomName() {
    return NAMES[Math.floor(Math.random() * NAMES.length)]
  }

  const ready = genre && tone && protagonist.trim().length > 0

  const handleBegin = () => {
    unlockAudio()
    setConfig({ genre, tone, protagonist: protagonist.trim(), scenario: useScenario && scenario.trim().length > 0 ? scenario.trim() : null })
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
        <Section label="03 // PROTAGONIST NAME">
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
            {/* Random name button */}
            <button
              onClick={() => setProtagonist(randomName())}
              title="Random name"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-dim)',
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                padding: '4px 10px',
                cursor: 'pointer',
                letterSpacing: 1,
                flexShrink: 0,
                transition: 'all 0.15s',
                borderRadius: 2,
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
              ⟳
            </button>
          </div>
        </Section>

        <Section label="04 // CUSTOM SCENARIO" last>
          {/* Checkbox toggle */}
          <div
            onClick={() => {
              setUseScenario(prev => !prev)
              setScenario('')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              marginBottom: useScenario ? 12 : 0,
              userSelect: 'none',
            }}
          >
            <div style={{
              width: 16,
              height: 16,
              border: `1px solid ${useScenario ? 'var(--green)' : 'var(--border)'}`,
              background: useScenario ? 'var(--green-dark)' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}>
              {useScenario && (
                <span style={{ color: 'var(--green)', fontSize: 11 }}>✓</span>
              )}
            </div>
            <span style={{
              fontSize: 12,
              color: useScenario ? 'var(--text)' : 'var(--text-dim)',
              letterSpacing: 1,
              transition: 'color 0.15s',
            }}>
              Set a custom opening scenario
            </span>
          </div>

          {/* Expandable textarea */}
          {useScenario && (
            <div className="scanin">
              <div style={{ position: 'relative' }}>
                <textarea
                  value={scenario}
                  onChange={e => {
                    if (e.target.value.length <= SCENARIO_LIMIT) {
                      setScenario(e.target.value)
                    }
                  }}
                  placeholder="e.g. I wake up on a spaceship with no memory of how I got here..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid var(--border-bright)',
                    outline: 'none',
                    color: 'var(--green)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    padding: '10px 12px',
                    resize: 'none',
                    caretColor: 'var(--green)',
                    lineHeight: 1.6,
                    letterSpacing: 0.5,
                  }}
                />
                {/* Character counter */}
                <div style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 10,
                  fontSize: 10,
                  letterSpacing: 1,
                  color: scenario.length >= SCENARIO_LIMIT
                    ? 'var(--red)'
                    : scenario.length >= SCENARIO_LIMIT * 0.8
                    ? 'var(--amber)'
                    : 'var(--text-dim)',
                }}>
                  {scenario.length}/{SCENARIO_LIMIT}
                </div>
              </div>
            </div>
          )}
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