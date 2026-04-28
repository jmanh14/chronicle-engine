import { useState, useEffect } from 'react'
import { unlockAudio } from './engine/audioManager'

// screens (we'll build these one at a time)
import SetupScreen  from './screens/SetupScreen'
import GameScreen   from './screens/GameScreen'
import EndingScreen from './screens/EndingScreen'
import ShelfScreen  from './screens/ShelfScreen'
import LandingScreen from './screens/LandingScreen'
import RotatePrompt from './components/RotatePrompt'

export default function App() {
  // unlock audio on first touch anywhere on the page
  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('touchstart', unlock, { passive: true })
    return () => window.removeEventListener('touchstart', unlock)
  }, [])

  const [screen, setScreen] = useState('landing')  // 'setup' | 'game' | 'ending' | 'shelf' | 'landing'
  const [config, setConfig]   = useState(null)   // genre, tone, protagonist from setup
  const [story, setStory]     = useState([])     // array of beat objects
  const [inventory, setInventory] = useState({ items: [], allies: [], enemies: [], status: [] })
  const [movieCard, setMovieCard] = useState(null)

  const navigate = (to) => setScreen(to)

  const screenProps = {
    navigate,
    config, setConfig,
    story,  setStory,
    inventory, setInventory,
    movieCard, setMovieCard,
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <RotatePrompt />
      {screen === 'landing'  && <LandingScreen  {...screenProps} />}
      {screen === 'setup'    && <SetupScreen    {...screenProps} />}
      {screen === 'game'     && <GameScreen     {...screenProps} />}
      {screen === 'ending'   && <EndingScreen   {...screenProps} />}
      {screen === 'shelf'    && <ShelfScreen    {...screenProps} />}
    </div>
  )
}