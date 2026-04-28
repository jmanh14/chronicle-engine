const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY

const VOICE_MAP = {
  Grim:        import.meta.env.VITE_VOICE_GRIM,
  Heroic:      import.meta.env.VITE_VOICE_HEROIC,
  Comedic:     import.meta.env.VITE_VOICE_COMEDIC,
  Mysterious:  import.meta.env.VITE_VOICE_MYSTERIOUS,
  Tense:       import.meta.env.VITE_VOICE_TENSE,
  Melancholic: import.meta.env.VITE_VOICE_MELANCHOLIC,
}

export function getVoiceForTone(tone) {
  return VOICE_MAP[tone] ?? import.meta.env.VITE_VOICE_DEFAULT
}

export async function fetchAudio(text, tone) {
  const voiceId = getVoiceForTone(tone)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.4,
        similarity_boost: 0.75,
      },
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    console.error('ElevenLabs error:', err)
    throw new Error(`ElevenLabs error: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  return `data:audio/mpeg;base64,${base64}`
}