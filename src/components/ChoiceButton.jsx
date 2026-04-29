import { useState } from 'react'
import { motion } from 'framer-motion'

const LABELS = ['A', 'B', 'C']

export default function ChoiceButton({ choice, index, onClick, disabled }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, delay: index * 0.08, ease: 'easeOut' }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        background: hovered ? 'var(--green-muted)' : 'var(--bg-panel)',
        border: `1px solid ${hovered ? 'var(--green)' : 'var(--border)'}`,
        color: hovered ? 'var(--green)' : 'var(--text)',
        fontFamily: 'var(--font-mono)',
        fontSize: 14,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s, border 0.15s, color 0.15s',
        borderRadius: 2,
        width: '100%',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: 20,
        color: hovered ? 'var(--green)' : 'var(--green-dim)',
        minWidth: 24,
      }}>
        {LABELS[index]}
      </span>
      <span>{choice.text}</span>
    </motion.button>
  )
}