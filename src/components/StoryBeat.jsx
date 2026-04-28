import { useState } from 'react'
import { fetchAudio } from '../engine/elevenlabs'
import { playAudio, stopAudio, isPlaying } from '../engine/audioManager'

export default function StoryBeat({ text, dimmed, tone, onPlayStart, onPlayEnd }) {
  const [state, setState] = useState('idle')

  async function handleSpeak() {
    if (state === 'playing' || state === 'loading') {
      stopAudio()
      setState('idle')
      return
    }

    setState('loading')
    onPlayStart?.()

    try {
      const url = await fetchAudio(text, tone)
      await playAudio(url, () => {
        setState('idle')
        onPlayEnd?.()
      })
      setState('playing')
    } catch (err) {
      console.error('TTS error:', err)
      setState('error')
    }
  }

  const icon = {
    idle:    '▶',
    loading: '…',
    playing: '■',
    error:   '⚠',
  }[state]

  const iconColor = {
    idle:    'var(--text-dim)',
    loading: 'var(--amber)',
    playing: 'var(--green)',
    error:   'var(--red)',
  }[state]

  return (
    <div style={{ position: 'relative' }}>
      {!dimmed && (
        <button
          onClick={handleSpeak}
          title={state === 'playing' ? 'Stop' : 'Narrate'}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'transparent',
            border: `1px solid ${state === 'playing' ? 'var(--green)' : 'var(--border)'}`,
            color: iconColor,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            padding: '3px 8px',
            cursor: 'pointer',
            letterSpacing: 2,
            transition: 'all 0.15s',
            borderRadius: 2,
          }}
        >
          {icon} {state === 'idle' ? 'NARRATE' : state.toUpperCase()}
        </button>
      )}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 15,
        lineHeight: 1.8,
        color: dimmed ? 'var(--text-dim)' : 'var(--text)',
        whiteSpace: 'pre-wrap',
        paddingRight: dimmed ? 0 : 100,
      }}>
        {text}
      </div>
    </div>
  )
}