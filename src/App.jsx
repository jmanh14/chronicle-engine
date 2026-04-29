import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store'
import { unlockAudio } from './engine/audioManager'

import LandingScreen  from './screens/LandingScreen'
import SetupScreen    from './screens/SetupScreen'
import GameScreen     from './screens/GameScreen'
import EndingScreen   from './screens/EndingScreen'
import ShelfScreen    from './screens/ShelfScreen'
import RotatePrompt   from './components/RotatePrompt'

const fadeSlide = {
  initial:    { opacity: 0, y: 10 },
  animate:    { opacity: 1, y: 0 },
  exit:       { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: 'easeInOut' }
}

export default function App() {
  const screen = useStore(s => s.screen)

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

  return (
    <div style={{ minHeight: '100vh' }}>
      <RotatePrompt />
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          {...fadeSlide}
          style={{ minHeight: '100vh' }}
        >
          {screen === 'landing'  && <LandingScreen  />}
          {screen === 'setup'    && <SetupScreen    />}
          {screen === 'game'     && <GameScreen     />}
          {screen === 'ending'   && <EndingScreen   />}
          {screen === 'shelf'    && <ShelfScreen    />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}