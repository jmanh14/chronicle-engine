import { useState, useRef } from 'react'
import { unlockAudio } from '../engine/audioManager'

export default function LandingScreen({ navigate }) {
  const [showHelp, setShowHelp] = useState(false)
  const helpAudioRef = useRef(null)

  function handleHelpOpen() {
    unlockAudio()
    setShowHelp(true)
    if (!helpAudioRef.current) {
      helpAudioRef.current = new Audio('/help-audio.mp3')
      helpAudioRef.current.playsInline = true
      helpAudioRef.current.setAttribute('playsinline', '')
      helpAudioRef.current.setAttribute('webkit-playsinline', '')
    }
    helpAudioRef.current.currentTime = 0
    helpAudioRef.current.play().catch(err => console.error('Help audio failed:', err))
  }

  function handleHelpClose() {
    setShowHelp(false)
    if (helpAudioRef.current) {
      helpAudioRef.current.pause()
      helpAudioRef.current.currentTime = 0
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      position: 'relative',
    }}>

      {/* Shelf link */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 28,
        fontSize: 11,
        color: 'var(--text-dim)',
        letterSpacing: 2,
      }}>
        <span
          onClick={() => navigate('shelf')}
          style={{ color: 'var(--green-dim)', cursor: 'pointer', textDecoration: 'underline' }}
        >
          VIEW SHELF
        </span>
      </div>

      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 72,
          color: 'var(--green)',
          letterSpacing: 8,
          lineHeight: 1,
          textShadow: '0 0 30px var(--green)',
          animation: 'flicker 8s infinite',
        }}>
          CHRONICLES
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-dim)',
          letterSpacing: 5,
          marginTop: 12,
          textTransform: 'uppercase',
        }}>
          AI Narrative Engine v1.0
        </div>
        <div style={{
          width: 120,
          height: 1,
          background: 'var(--green-dark)',
          margin: '20px auto 0',
        }} />
      </div>

      {/* Buttons / Help panel */}
      {!showHelp ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 320 }}>
          <button
            onClick={() => {
              unlockAudio()
              navigate('setup')
            }}
            style={{
              padding: '16px',
              background: 'var(--green-dark)',
              border: '1px solid var(--green)',
              color: 'var(--green)',
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              letterSpacing: 4,
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={e => e.target.style.background = '#005c1a'}
            onMouseLeave={e => e.target.style.background = 'var(--green-dark)'}
          >
            BEGIN
          </button>

          <button
            onClick={handleHelpOpen}
            style={{
              padding: '12px',
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: 13,
              letterSpacing: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={e => e.target.style.borderColor = 'var(--green-dim)'}
            onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
          >
            ? HOW TO PLAY
          </button>
        </div>
      ) : (
        <div style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          padding: '28px',
          animation: 'scanin 0.3s ease forwards',
        }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            color: 'var(--green)',
            letterSpacing: 3,
            marginBottom: 20,
          }}>
            HOW TO PLAY
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { step: '01', text: 'Choose a genre, tone, and name your protagonist on the setup screen.' },
              { step: '02', text: 'The AI generates a story beat — an atmospheric scene ending at a moment of decision.' },
              { step: '03', text: 'Pick from three choices to shape what happens next. Each choice drives the narrative forward.' },
              { step: '04', text: 'Your inventory tracks key items, allies, enemies, and your current status as the story evolves.' },
              { step: '05', text: 'The AI decides when the story reaches its natural conclusion. No two playthroughs are the same.' },
              { step: '06', text: 'At the end, a Movie Card is generated summarizing your story. Save it to your Shelf to keep it forever.' },
            ].map(({ step, text }) => (
              <div key={step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20,
                  color: 'var(--green-dim)',
                  minWidth: 32,
                  letterSpacing: 1,
                }}>
                  {step}
                </div>
                <div style={{
                  fontSize: 13,
                  color: 'var(--text)',
                  lineHeight: 1.7,
                  letterSpacing: 0.5,
                }}>
                  {text}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleHelpClose}
            style={{
              marginTop: 24,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              letterSpacing: 2,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            ← BACK
          </button>
        </div>
      )}

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        fontSize: 10,
        color: 'var(--text-dim)',
        letterSpacing: 3,
        opacity: 0.4,
      }}>
        POWERED BY CLAUDE AI // ELEVENLABS
      </div>

    </div>
  )
}