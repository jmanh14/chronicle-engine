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

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps`, {
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

  const data = await response.json()
  console.log('ElevenLabs keys:', Object.keys(data))
  console.log('audio_base64 length:', data.audio_base64?.length)
  console.log('alignment:', data.alignment)
  const audioSrc = `data:audio/mpeg;base64,${data.audio_base64}`
  const alignment = data.alignment

  // build sentence timing map from character timestamps
  const sentenceTimes = buildSentenceTimes(text, alignment)

  return { audioSrc, sentenceTimes }
}

function buildSentenceTimes(text, alignment) {
  if (!alignment) return []

  const { characters, character_start_times_seconds, character_end_times_seconds } = alignment

  // split into sentences but preserve paragraph structure
  const sentenceRegex = /[^.!?]+[.!?]+/g
  const sentences = []
  let match
  let lastEnd = 0

  while ((match = sentenceRegex.exec(text)) !== null) {
    // check if there are newlines between last sentence and this one
    const gap = text.slice(lastEnd, match.index)
    if (gap.includes('\n') && sentences.length > 0) {
      // add the newlines to the previous sentence
      sentences[sentences.length - 1].text += gap.trimEnd()
    }

    sentences.push({
      text: match[0],
      start: match.index,
      end: match.index + match[0].length,
    })
    lastEnd = match.index + match[0].length
  }

  // map character indices to timestamps
  return sentences.map(({ text: sentText, start, end }) => {
    const startTime = character_start_times_seconds[start] ?? 0
    const endTime   = character_end_times_seconds[Math.min(end - 1, character_end_times_seconds.length - 1)] ?? 0
    return { text: sentText, startTime, endTime }
  })
}