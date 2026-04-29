import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import { generateOpening, generateContinuation } from '../engine/api'
import { fetchAudio } from '../engine/elevenlabs'
import { playAudio, stopAudio, clearAudio, isPaused } from '../engine/audioManager'
import InventoryPanel from '../components/InventoryPanel'
import StoryBeat from '../components/StoryBeat'
import ChoiceButton from '../components/ChoiceButton'
import BootSequence from '../components/BootSequence'
import GlitchText from '../components/GlitchText'

export default function GameScreen() {
  const navigate     = useStore(s => s.navigate)
  const config       = useStore(s => s.config)
  const story        = useStore(s => s.story)
  const setStory     = useStore(s => s.setStory)
  const inventory    = useStore(s => s.inventory)
  const setInventory = useStore(s => s.setInventory)
  const setMovieCard = useStore(s => s.setMovieCard)
  const [currentBeat, setCurrentBeat] = useState(null)
  const [choices, setChoices]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [turn, setTurn]               = useState(0)
  const [storyTitle, setStoryTitle]   = useState('UNTITLED')
  const [booting, setBooting]         = useState(true)
  const [audioState, setAudioState]   = useState('idle')
  const [narrateOn, setNarrateOn]     = useState(false)
  const [beatReady, setBeatReady]     = useState(false)
  const [pendingBeat, setPendingBeat] = useState(null)
  const [pendingUrl, setPendingUrl]   = useState(null)
  const [sentenceTimes, setSentenceTimes] = useState([])
  const [audioTime, setAudioTime]         = useState(0)
  const [dossierOpen, setDossierOpen] = useState(true)
  const [isEnding, setIsEnding]       = useState(false)
  const hasStarted                    = useRef(false)
  const bottomRef                     = useRef(null)
  const [consequences, setConsequences] = useState([])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    startStory()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(timer)
  }, [currentBeat, loading, story])

  useEffect(() => {
    if (!booting && beatReady && pendingBeat && pendingUrl) {
      revealBeat(pendingBeat, pendingUrl)
    }
  }, [booting, beatReady])

  async function startStory() {
    setError(null)
    try {
      const beat = await generateOpening(config)
      let audioData = null
      try {
        audioData = await fetchAudio(beat.story, config.tone)
      } catch (audioErr) {
        console.error('Audio fetch failed:', audioErr)
      }
      setPendingBeat(beat)
      setPendingUrl(audioData)
      setBeatReady(true)
    } catch (err) {
      console.error('Story generation failed:', err)
      setError('SIGNAL LOST. Failed to initialize narrative.')
      setBeatReady(true)
    }
  }

  async function revealBeat(beat, audioData) {
    setCurrentBeat(beat)
    setChoices(beat.choices)
    setInventory(beat.inventory)
    setConsequences(beat.consequences ?? [])
    setStoryTitle(beat.title)
    setTurn(1)
    setPendingBeat(null)
    setPendingUrl(null)
    if (narrateOn && audioData) {
      setSentenceTimes(audioData.sentenceTimes ?? [])
      setAudioTime(0)
      await playAudio(
        audioData.audioSrc,
        () => setAudioState('idle'),
        (t) => setAudioTime(t)
      )
      setAudioState('playing')
    }
  }

  function handleBootComplete() {
    setBooting(false)
  }

  function handleRetry() {
    setError(null)
    setLoading(false)
    setChoices(currentBeat ? currentBeat.choices : [])
  }

  async function handleChoice(choice) {
    if (loading) return

    const newHistory = [
      ...story,
      {
        story: currentBeat.story,
        choiceText: choice.text,
        choiceId: choice.id,
      }
    ]

    setStory(newHistory)
    setLoading(true)
    setError(null)
    setChoices([])
    clearAudio()
    setAudioState('idle')

    try {
      const beat = await generateContinuation({
        config,
        history: newHistory,
        inventory,
        choice: choice.id,
        choiceText: choice.text,
        consequences,
      })

      setInventory(beat.inventory)
      setConsequences(beat.consequences ?? consequences)
      setTurn(t => t + 1)

      if (beat.isEnding) {
        const finalHistory = [
          ...newHistory,
          { story: beat.story, choiceText: null, choiceId: null }
        ]
        setStory(finalHistory)
        setMovieCard({ title: beat.title, genre: config.genre, tone: config.tone })
        setCurrentBeat(beat)
        setChoices([])
        setLoading(false)

        let audioData = null
        try {
          audioData = await fetchAudio(beat.story, config.tone)
        } catch (audioErr) {
          console.error('Audio fetch failed:', audioErr)
        }

        if (narrateOn && audioData) {
          setSentenceTimes(audioData.sentenceTimes ?? [])
          setAudioTime(0)
          await new Promise(resolve => {
            playAudio(
              audioData.audioSrc,
              () => {
                setAudioState('idle')
                resolve()
              },
              (t) => setAudioTime(t)
            )
            setAudioState('playing')
          })
        }

        setIsEnding(true)

      } else {
        let audioData = null
        try {
          audioData = await fetchAudio(beat.story, config.tone)
        } catch (audioErr) {
          console.error('Audio fetch failed:', audioErr)
        }
        setCurrentBeat(beat)
        setChoices(beat.choices)
        setLoading(false)
        if (narrateOn && audioData) {
          setSentenceTimes(audioData.sentenceTimes ?? [])
          setAudioTime(0)
          await playAudio(
            audioData.audioSrc,
            () => setAudioState('idle'),
            (t) => setAudioTime(t)
          )
          setAudioState('playing')
        }
      }
    } catch (err) {
      setError('SIGNAL LOST. Transmission interrupted.')
      setLoading(false)
      if (currentBeat?.choices) {
        setChoices(currentBeat.choices)
      }
    }
  }

  async function handleManualNarrate() {
    if (narrateOn) {
      stopAudio()
      setAudioState('idle')
      setNarrateOn(false)
    } else {
      setNarrateOn(true)
      if (currentBeat) {
        if (isPaused()) {
          setAudioState('playing')
          await playAudio(null, () => setAudioState('idle'), (t) => setAudioTime(t), true)
        } else {
          setAudioState('loading')
          try {
            const audioData = await fetchAudio(currentBeat.story, config.tone)
            setSentenceTimes(audioData.sentenceTimes ?? [])
            setAudioTime(0)
            await playAudio(
              audioData.audioSrc,
              () => setAudioState('idle'),
              (t) => setAudioTime(t)
            )
            setAudioState('playing')
          } catch {
            setAudioState('idle')
          }
        }
      }
    }
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden' }}>

      {/* Boot sequence overlay */}
      {booting && (
        <BootSequence
          config={config}
          onComplete={handleBootComplete}
          beatReady={beatReady}
        />
      )}

      {/* Main layout */}
      <div style={{
        display: booting ? 'none' : 'grid',
        gridTemplateColumns: dossierOpen ? '1fr clamp(140px, 20vw, 260px)' : '1fr',
        height: '100vh',
        overflow: 'hidden',
        transition: 'grid-template-columns 0.3s ease',
      }}>

        {/* ── LEFT: main story column ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          height: '100vh',
          overflow: 'hidden',
        }}>

          {/* Fixed header */}
          <div style={{
            padding: '12px 16px 10px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(16px, 3vw, 28px)',
                  color: 'var(--green)',
                  letterSpacing: 2,
                  textShadow: '0 0 10px var(--green)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {storyTitle.toUpperCase()}
                </div>
                <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: 'var(--text-dim)', letterSpacing: 2, marginTop: 2 }}>
                  {config.genre.toUpperCase()} // {config.tone.toUpperCase()} // TURN {turn}
                </div>
              </div>

              {/* Right side — protagonist + buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginLeft: 12 }}>
                <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: 'var(--text-dim)', letterSpacing: 1 }}>
                  <span style={{ color: 'var(--green)' }}>&gt;</span> {config.protagonist}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {/* Narrate button */}
                  <button
                    onClick={handleManualNarrate}
                    style={{
                      background: narrateOn ? 'var(--green-dark)' : 'transparent',
                      border: `1px solid ${narrateOn ? 'var(--green)' : 'var(--border)'}`,
                      color: narrateOn
                        ? audioState === 'loading' ? 'var(--amber)' : 'var(--green)'
                        : 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(9px, 1.2vw, 11px)',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      letterSpacing: 1,
                      borderRadius: 2,
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {narrateOn
                      ? audioState === 'loading' ? '… LOADING'
                      : audioState === 'playing' ? '■ NARRATE ON'
                      : '▶ NARRATE ON'
                      : '▶ NARRATE OFF'}
                  </button>

                  {/* Dossier toggle button */}
                  <button
                    onClick={() => setDossierOpen(prev => !prev)}
                    title={dossierOpen ? 'Hide Dossier' : 'Show Dossier'}
                    style={{
                      background: dossierOpen ? 'var(--green-dark)' : 'transparent',
                      border: `1px solid ${dossierOpen ? 'var(--green)' : 'var(--border)'}`,
                      color: dossierOpen ? 'var(--green)' : 'var(--text-dim)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(9px, 1.2vw, 11px)',
                      padding: '3px 8px',
                      cursor: 'pointer',
                      letterSpacing: 1,
                      borderRadius: 2,
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {dossierOpen ? '▶▶ DOSSIER' : '◀◀ DOSSIER'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable story area */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            WebkitOverflowScrolling: 'touch',
          }}>

            {/* History beats */}
            {story.map((beat, i) => (
              <div key={i} style={{ marginBottom: 20, opacity: 0.45 }}>
                <StoryBeat text={beat.story} dimmed />
                {beat.choiceText && (
                  <div style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: 'var(--green-dim)',
                    fontStyle: 'italic',
                    paddingLeft: 12,
                    borderLeft: '2px solid var(--green-dark)',
                  }}>
                    &gt; {beat.choiceText}
                  </div>
                )}
              </div>
            ))}

            {/* Current beat with glitch effect */}
            {currentBeat && !loading && (
              <div className="scanin">
                <GlitchText
                  text={currentBeat.story}
                  sentenceTimes={sentenceTimes}
                  currentTime={audioTime}
                />
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{
                padding: '20px 0',
                color: 'var(--green-dim)',
                fontSize: 13,
                letterSpacing: 2,
              }}>
                <span className="blink">█</span> GENERATING NARRATIVE...
              </div>
            )}

            {/* Error */}
            {error && (
              <div style={{
                padding: '12px 16px',
                border: '1px solid var(--red)',
                color: 'var(--red)',
                fontSize: 13,
                letterSpacing: 1,
                marginBottom: 16,
              }}>
                ⚠ {error}
                <button
                  onClick={handleRetry}
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

            <div ref={bottomRef} style={{ height: 8 }} />
          </div>

          {/* Fixed choices footer */}
          {!loading && choices.length > 0 && (
            <div style={{
              padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2vw, 28px)',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
              background: 'var(--bg)',
              overflowY: 'auto',
              maxHeight: '35vh',
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--text-dim)',
                letterSpacing: 3,
                marginBottom: 12,
                textTransform: 'uppercase',
              }}>
                // Choose your action
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {choices.map((choice, i) => (
                  <ChoiceButton
                    key={choice.id}
                    index={i}
                    choice={choice}
                    onClick={() => handleChoice(choice)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ending continue button */}
          {isEnding && !loading && (
            <div style={{
              padding: 'clamp(10px, 2vw, 16px) clamp(12px, 2vw, 28px)',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
              background: 'var(--bg)',
            }}>
              <div style={{
                fontSize: 11,
                color: 'var(--text-dim)',
                letterSpacing: 3,
                marginBottom: 12,
                textTransform: 'uppercase',
              }}>
                // Your story has ended
              </div>
              <button
                onClick={() => navigate('ending')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'var(--green-dark)',
                  border: '1px solid var(--green)',
                  color: 'var(--green)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  letterSpacing: 4,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#005c1a'}
                onMouseLeave={e => e.target.style.background = 'var(--green-dark)'}
              >
                VIEW STORY RECORD →
              </button>
            </div>
          )}

        </div>

        {/* ── RIGHT: inventory panel ── */}
        {dossierOpen && (
          <InventoryPanel
            inventory={inventory}
            turn={turn}
            protagonist={config.protagonist}
          />
        )}
      </div>
    </div>
  )
}