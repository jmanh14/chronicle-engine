let audioEl = null
let progressInterval = null

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
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (audioEl) {
    audioEl.pause()
  }
}

export function clearAudio() {
  stopAudio()
  if (audioEl) {
    audioEl.src = ''
    audioEl.currentTime = 0
  }
}

export async function playAudio(audioSrc, onEnd, onTimeUpdate, resume = false) {
  const el = getOrCreateAudioEl()

  if (resume && el.src && el.currentTime > 0) {
    el.onended = () => onEnd?.()
    if (progressInterval) clearInterval(progressInterval)
    if (onTimeUpdate) {
      progressInterval = setInterval(() => {
        onTimeUpdate(el.currentTime)
      }, 50)
    }
    try {
      await el.play()
    } catch (err) {
      console.error('Resume failed:', err.name, err.message)
    }
    return
  }

  clearAudio()
  el.src = audioSrc
  el.onended = () => {
    if (progressInterval) {
      clearInterval(progressInterval)
      progressInterval = null
    }
    onEnd?.()
  }

  if (onTimeUpdate) {
    progressInterval = setInterval(() => {
      onTimeUpdate(el.currentTime)
    }, 50)
  }

  try {
    await el.play()
  } catch (err) {
    console.error('Audio play failed:', err.name, err.message)
  }
}

export function isPaused() {
  return audioEl !== null && audioEl.paused && audioEl.currentTime > 0
}

export function isPlaying() {
  return audioEl !== null && !audioEl.paused
}