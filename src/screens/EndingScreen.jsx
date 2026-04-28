import { useState, useEffect } from 'react'
import { generateMovieCard } from '../engine/api'
import { saveStory } from '../storage/shelf'
import MovieCard from '../components/MovieCard'

export default function EndingScreen({ config, story, movieCard, setMovieCard, navigate }) {
  const [loading, setLoading]   = useState(true)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState(null)
  const [cardData, setCardData] = useState(null)

  useEffect(() => {
    generateCard()
  }, [])

  async function generateCard() {
    setLoading(true)
    setError(null)
    try {
      const card = await generateMovieCard({
        config,
        history: story,
        title: movieCard?.title ?? 'Untitled',
      })
      setCardData(card)
      setMovieCard(card)
    } catch (err) {
      setError('SIGNAL LOST. Failed to generate story record.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!cardData || saved) return
    const key = saveStory(cardData)
    if (key) setSaved(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
    }}>

      {/* Header */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 14,
        letterSpacing: 6,
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
        marginBottom: 32,
      }}>
        // Transmission Complete
      </div>

      {loading && (
        <div style={{
          color: 'var(--green-dim)',
          fontSize: 13,
          letterSpacing: 3,
          textAlign: 'center',
        }}>
          <span className="blink">█</span> COMPILING STORY RECORD...
        </div>
      )}

      {error && (
        <div style={{
          color: 'var(--red)',
          fontSize: 13,
          letterSpacing: 1,
          border: '1px solid var(--red)',
          padding: '12px 20px',
          marginBottom: 24,
        }}>
          ⚠ {error}
          <button
            onClick={generateCard}
            style={{
              marginLeft: 16,
              background: 'transparent',
              border: 'none',
              color: 'var(--amber)',
              fontFamily: 'var(--font-mono)',
              cursor: 'pointer',
              fontSize: 13,
              textDecoration: 'underline',
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {/* Movie card */}
      {cardData && !loading && (
        <div className="scanin" style={{ width: '100%', maxWidth: 520 }}>
          <MovieCard card={cardData} />

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginTop: 24,
          }}>
            <ActionButton
              onClick={handleSave}
              disabled={saved}
              color={saved ? 'var(--text-dim)' : 'var(--green)'}
              borderColor={saved ? 'var(--border)' : 'var(--green)'}
            >
              {saved ? '✓ SAVED TO SHELF' : 'SAVE TO SHELF'}
            </ActionButton>

            <ActionButton
              onClick={() => navigate('setup')}
              color="var(--amber)"
              borderColor="var(--amber)"
            >
              NEW STORY
            </ActionButton>

            <ActionButton
              onClick={() => navigate('shelf')}
              color="var(--text-dim)"
              borderColor="var(--border)"
            >
              VIEW SHELF
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionButton({ onClick, disabled, color, borderColor, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '10px 0',
        background: hovered && !disabled ? 'var(--green-muted)' : 'transparent',
        border: `1px solid ${borderColor}`,
        color,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        letterSpacing: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  )
}