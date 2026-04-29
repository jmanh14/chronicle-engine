import { buildSetupPrompt, buildContinuationPrompt, buildMovieCardPrompt } from './prompts'

const MODEL = 'claude-sonnet-4-20250514'
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

async function callClaude(prompt) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) throw new Error(`API error: ${response.status}`)

  const data = await response.json()
  const raw = data.content.map(b => b.text || '').join('')

  try {
    return JSON.parse(raw)
  } catch {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  }
}

export async function generateOpening(config) {
  const prompt = buildSetupPrompt(config)
  return callClaude(prompt)
}

export async function generateContinuation({ config, history, inventory, choice, choiceText, consequences }) {
  const prompt = buildContinuationPrompt({
    genre: config.genre,
    tone: config.tone,
    protagonist: config.protagonist,
    history,
    inventory,
    choice,
    choiceText,
    consequences,
  })
  return callClaude(prompt)
}

export async function generateMovieCard({ config, history, title }) {
  const prompt = buildMovieCardPrompt({
    genre: config.genre,
    tone: config.tone,
    protagonist: config.protagonist,
    history,
    title,
  })
  return callClaude(prompt)
}