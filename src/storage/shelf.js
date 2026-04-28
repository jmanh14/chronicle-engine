const PREFIX = 'chronicle_'

export function saveStory(movieCard) {
  try {
    const key = `${PREFIX}${Date.now()}`
    localStorage.setItem(key, JSON.stringify(movieCard))
    return key
  } catch (err) {
    console.error('Save failed:', err)
    return null
  }
}

export function loadAllStories() {
  try {
    const stories = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(PREFIX)) {
        try {
          const value = localStorage.getItem(key)
          if (value) stories.push({ key, ...JSON.parse(value) })
        } catch {
          // skip corrupted entries
        }
      }
    }
    return stories.sort((a, b) => {
      const tsA = parseInt(a.key.replace(PREFIX, ''))
      const tsB = parseInt(b.key.replace(PREFIX, ''))
      return tsB - tsA
    })
  } catch (err) {
    console.error('Load failed:', err)
    return []
  }
}

export function deleteStory(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (err) {
    console.error('Delete failed:', err)
    return false
  }
}