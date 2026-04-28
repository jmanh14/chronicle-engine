let audioEl = null

function getOrCreateAudioEl() {
  if (!audioEl) {
    audioEl = document.createElement('audio')
    audioEl.playsInline = true
    audioEl.setAttribute('playsinline', '')
    audioEl.setAttribute('webkit-playsinline', '')
    document.body.appendChild(audioEl)
  }
  return audioEl
}

export function unlockAudio() {
  const el = getOrCreateAudioEl()
  el.play().catch(() => {})
}

export function stopAudio() {
  if (audioEl) {
    audioEl.pause()
    // don't clear src or reset currentTime — keeps position
  }
}

export function clearAudio() {
  // call this when moving to a NEW beat to fully reset
  if (audioEl) {
    audioEl.pause()
    audioEl.src = ''
    audioEl.currentTime = 0
  }
}

export async function playAudio(url, onEnd, resume = false) {
  const el = getOrCreateAudioEl()

  if (resume && el.src && el.currentTime > 0) {
    // resume from where we left off
    el.onended = () => onEnd?.()
    try {
      await el.play()
    } catch (err) {
      console.error('Resume failed:', err.name, err.message)
    }
    return
  }

  // new audio
  clearAudio()
  el.src = url
  el.onended = () => onEnd?.()
  try {
    await el.play()
  } catch (err) {
    console.error('Audio play failed:', err.name, err.message)
  }
}

export function isPlaying() {
  return audioEl !== null && !audioEl.paused
}

export function isPaused() {
  return audioEl !== null && audioEl.paused && audioEl.currentTime > 0
}