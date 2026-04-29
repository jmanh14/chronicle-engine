export function buildSetupPrompt({ genre, tone, protagonist, scenario }) {
  const scenarioLine = scenario
    ? `\nThe story should begin with this scenario: ${scenario}`
    : ''

  return `You are a narrative engine for an interactive text adventure. Generate the opening beat of a ${tone.toLowerCase()} ${genre.toLowerCase()} story.

The protagonist's name is ${protagonist}.${scenarioLine}

Respond ONLY with a valid JSON object in exactly this structure, no markdown, no explanation:
{
  "story": "2-4 paragraphs of vivid, atmospheric story text. End at a moment of decision.",
  "choices": [
    { "id": "a", "text": "Short action or decision (max 12 words)" },
    { "id": "b", "text": "Short action or decision (max 12 words)" },
    { "id": "c", "text": "Short action or decision (max 12 words)" }
  ],
  "inventory": {
    "items": [],
    "allies": [],
    "enemies": [],
    "status": ["Beginning of the journey"]
  },
  "consequences": [],
  "isEnding": false,
  "title": "A short evocative working title for this story (4-6 words)"
}`
}

export function buildContinuationPrompt({ genre, tone, protagonist, history, inventory, choice, choiceText, consequences }) {
  const historyText = history
    .map((beat, i) => `--- Beat ${i + 1} ---\n${beat.story}\nPlayer chose: ${beat.choiceText}`)
    .join('\n\n')

  const inventoryText = JSON.stringify(inventory, null, 2)

  const consequencesText = consequences && consequences.length > 0
    ? `\nACTIVE CONSEQUENCES (these must influence the story going forward):\n${consequences.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    : ''

  return `You are a narrative engine for an interactive ${tone.toLowerCase()} ${genre.toLowerCase()} story.
Protagonist: ${protagonist}

STORY SO FAR:
${historyText}

CURRENT INVENTORY STATE:
${inventoryText}
${consequencesText}

The player just chose: "${choiceText}"

Continue the story naturally from this choice. Active consequences MUST ripple into the narrative — NPCs remember past actions, doors that were closed stay closed, debts get called in. Make the world feel reactive to every decision made so far.

You decide if the story should end based on narrative flow — a satisfying conclusion can happen anywhere from turn 4 onward.

Respond ONLY with a valid JSON object in exactly this structure, no markdown, no explanation:
{
  "story": "2-4 paragraphs continuing the narrative from the player's choice.",
  "choices": [
    { "id": "a", "text": "Short action or decision (max 12 words)" },
    { "id": "b", "text": "Short action or decision (max 12 words)" },
    { "id": "c", "text": "Short action or decision (max 12 words)" }
  ],
  "inventory": {
    "items": ["list of key items the protagonist currently has"],
    "allies": ["list of current allies or companions"],
    "enemies": ["list of known threats or antagonists"],
    "status": ["current condition, wounds, mental state, etc"]
  },
  "consequences": [
    "carry forward all existing consequences plus add any new ones from this beat. Each consequence is one sentence describing a lasting effect of a choice made."
  ],
  "isEnding": false,
  "title": "A short evocative working title for this story (4-6 words)"
}

If this IS the ending set isEnding to true and make choices an empty array.`
}

export function buildMovieCardPrompt({ genre, tone, protagonist, history, title }) {
  const fullStory = history.map((beat, i) => `Beat ${i + 1}: ${beat.story}`).join('\n\n')

  return `You are a creative director generating a "movie card" summary for a completed interactive story.

Genre: ${genre}
Tone: ${tone}
Protagonist: ${protagonist}
Working Title: ${title}

FULL STORY:
${fullStory}

Generate a compelling movie card for this story. Respond ONLY with valid JSON, no markdown, no explanation:
{
  "title": "Final polished story title (punchy, evocative, 3-6 words)",
  "tagline": "One-sentence tagline like a movie poster (max 15 words)",
  "genre": "${genre}",
  "tone": "${tone}",
  "protagonist": "${protagonist}",
  "synopsis": "2-3 sentence summary of the full story arc",
  "outcome": "SURVIVED | PERISHED | TRIUMPHANT | DEFEATED | ESCAPED | ASCENDED | LOST | REDEEMED",
  "turnsPlayed": ${history.length},
  "rating": "G | PG | PG-13 | R"
}`
}