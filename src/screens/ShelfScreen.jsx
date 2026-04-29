import { useState, useEffect } from 'react'
import { useStore } from '../store'
import { loadAllStories, deleteStory } from '../storage/shelf'
import MovieCard from '../components/MovieCard'

export default function ShelfScreen({ navigate }) {
  const navigate = useStore(s => s.navigate)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect (() => {
    const data = loadAllStories()
    setStories(data)
    setLoading(false)
  }, [])

  async function handleDelete(key) {
    deleteStory(key)
    setStories(prev => prev.filter(s => s.key !== key))
  }

  return (
    <div style={{
      maxWidth: 640,
      margin: '0 auto',
      padding: '40px 24px',
    }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        borderBottom: '1px solid var(--border)',
        paddingBottom: 16,
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            color: 'var(--green)',
            letterSpacing: 4,
            textShadow: '0 0 10px var(--green)',
          }}>
            THE SHELF
          </div>
          <div style={{
            fontSize: 11,
            color: 'var(--text-dim)',
            letterSpacing: 3,
            marginTop: 4,
          }}>
            {stories.length} STOR{stories.length === 1 ? 'Y' : 'IES'} RECORDED
          </div>
        </div>
        <button
          onClick={() => navigate('setup')}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--green-dim)',
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: 2,
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          + NEW STORY
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ color: 'var(--green-dim)', fontSize: 13, letterSpacing: 2 }}>
          <span className="blink">█</span> LOADING RECORDS...
        </div>
      )}

      {/* Empty state */}
      {!loading && stories.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 0',
          color: 'var(--text-dim)',
          fontSize: 13,
          letterSpacing: 2,
        }}>
          <div style={{ fontSize: 32, marginBottom: 16, opacity: 0.3 }}>◎</div>
          NO STORIES RECORDED YET
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>
            Complete a story to save it here
          </div>
        </div>
      )}

      {/* Story list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {stories.map((story) => (
          <div key={story.key} className="scanin">
            <MovieCard card={story} animate={false}/>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => handleDelete(story.key)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: 2,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '4px 0',
                }}
              >
                DELETE RECORD
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}