import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

// ... keep everything the same until the entries map ...

{entries.map((entry, i) => {
  const isNew = newEntries.current.has(entry)
  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: i * 0.05 }}
      style={{
        fontSize: 'clamp(10px, 1.5vw, 12px)',
        color: key === 'enemies' ? 'var(--red)' : key === 'allies' ? 'var(--amber)' : 'var(--text)',
        paddingLeft: 4,
        borderLeft: `2px solid ${
          key === 'enemies' ? 'var(--red)'
          : key === 'allies' ? 'var(--amber)'
          : 'var(--green-dark)'
        }`,
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
      }}
    >
      <span>{entry}</span>
      {isNew && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: 9,
            letterSpacing: 2,
            color: 'var(--bg)',
            background: 'var(--green)',
            padding: '1px 5px',
            flexShrink: 0,
          }}
        >
          NEW
        </motion.span>
      )}
    </motion.div>
  )
})}