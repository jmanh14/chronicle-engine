import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { unlockAudio } from './engine/audioManager'

import LandingScreen  from './screens/LandingScreen'
import SetupScreen    from './screens/SetupScreen'
import GameScreen     from './screens/GameScreen'
import EndingScreen   from './screens/EndingScreen'
import ShelfScreen    from './screens/ShelfScreen'
import RotatePrompt   from './components/RotatePrompt'

const fadeSlide = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0 },
  exit:     { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}

export default function App() {
  const [screen, setScreen]       = useState('landing')
  const [config, setConfig]       = useState(null)
  const [story, setStory]         = useState([])
  const [inventory, setInventory] = useState({ items: [], allies: [], enemies: [], status: [] })
  const [movieCard, setMovieCard] = useState(null)

  useEffect(() => {
    const unlock = () => {
      unlockAudio()
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('click', unlock)
    }
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('click', unlock)
    return () => {
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('click', unlock)
    }
  }, [])

  const navigate = (to) => setScreen(to)

  const screenProps = {
    navigate,
    config,  setConfig,
    story,   setStory,
    inventory, setInventory,
    movieCard, setMovieCard,
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <RotatePrompt />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          {...fadeSlide}
          style={{ minHeight: '100vh' }}
        >
          {screen === 'landing'  && <LandingScreen  {...screenProps} />}
          {screen === 'setup'    && <SetupScreen    {...screenProps} />}
          {screen === 'game'     && <GameScreen     {...screenProps} />}
          {screen === 'ending'   && <EndingScreen   {...screenProps} />}
          {screen === 'shelf'    && <ShelfScreen    {...screenProps} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}