const STYLE_MAP = {
  Fantasy:          'epic high fantasy prose, reminiscent of Tolkien. Rich world-building, mythic weight, poetic descriptions of magic and landscape.',
  Horror:           'unsettling psychological horror, reminiscent of Stephen King. Build dread slowly, use everyday details to make the uncanny feel real.',
  'Sci-Fi':         'cerebral science fiction, reminiscent of Philip K. Dick. Question reality, use precise technical language mixed with philosophical unease.',
  Western:          'sparse frontier prose, reminiscent of Cormac McCarthy. Short declarative sentences, brutal honesty, vast empty landscapes.',
  Noir:             'hardboiled detective fiction, reminiscent of Raymond Chandler. Cynical first-person energy, sharp metaphors, moral ambiguity everywhere.',
  'Post-Apocalyptic': 'bleak survival prose, reminiscent of The Road by Cormac McCarthy. Stripped down language, exhaustion in every sentence, beauty in small moments.',
  Isekai:           'light novel style with vivid world-building and a sense of wonder. Fast pacing, clear character voice, exciting discovery of new rules and systems.',
  Pirate:           'swashbuckling adventure prose, reminiscent of Treasure Island. Bold and energetic, salt air and danger, honor among thieves.',
  'Alien Invasion':  'tense military sci-fi reminiscent of H.G. Wells. Clinical descriptions of the incomprehensible, human fragility against overwhelming force.',
  Lovecraftian:     'cosmic dread and ornate prose reminiscent of H.P. Lovecraft. Creeping realization of insignificance, sanity unraveling at the edges, never fully describe the horror.',
  Dreams:           'surreal stream of consciousness reminiscent of Kafka. Logic that almost makes sense, mundane mixed with impossible, identity slipping.',
}

const BANNED_PHRASES = [
  'suddenly', 'little did they know', 'out of nowhere', 'in the blink of an eye',
  'little did he know', 'little did she know', 'as if on cue', 'needless to say',
  'it was at that moment', 'without warning'
]

export function buildSetupPrompt({ genre, tone, protagonist, scenario }) {
  const scenarioLine = scenario
    ? `\nThe story should begin with this scenario: ${scenario}`
    : ''

  const style = STYLE_MAP[genre] ?? 'vivid and atmospheric prose'

  return `You are a narrative engine for an interactive text adventure. Generate the opening beat of a ${tone.toLowerCase()} ${genre.toLowerCase()} story.

The protagonist's name is ${protagonist}.${scenarioLine}

WRITING STYLE: Write in ${style}
BANNED PHRASES: Never use these phrases: ${BANNED_PHRASES.join(', ')}

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
  "location": "Brief description of current location (5-8 words)",
  "timeOfDay": "morning | afternoon | evening | night",
  "tension": 1,
  "isEnding": false,
  "title": "A short evocative working title for this story (4-6 words)"
}`
}

export function buildContinuationPrompt({ genre, tone, protagonist, history, inventory, choice, choiceText, consequences, location, timeOfDay, tension }) {
  const historyText = history
    .map((beat, i) => `--- Beat ${i + 1} ---\n${beat.story}\nPlayer chose: ${beat.choiceText}`)
    .join('\n\n')

  const inventoryText = JSON.stringify(inventory, null, 2)

  const consequencesText = consequences && consequences.length > 0
    ? `\nACTIVE CONSEQUENCES (these must influence the story going forward):\n${consequences.map((c, i) => `${i + 1}. ${c}`).join('\n')}`
    : ''

  const style = STYLE_MAP[genre] ?? 'vivid and atmospheric prose'
  const nextTension = Math.min(tension + 1, 10)

  return `You are a narrative engine for an interactive ${tone.toLowerCase()} ${genre.toLowerCase()} story.
Protagonist: ${protagonist}

WRITING STYLE: Write in ${style}
BANNED PHRASES: Never use these phrases: ${BANNED_PHRASES.join(', ')}

CURRENT STATE:
- Location: ${location ?? 'unknown'}
- Time of day: ${timeOfDay ?? 'unknown'}
- Tension level: ${tension}/10 (escalate toward ${nextTension}/10 this beat)

STORY SO FAR:
${historyText}

CURRENT INVENTORY STATE:
${inventoryText}
${consequencesText}

The player just chose: "${choiceText}"

Continue the story naturally. Active consequences MUST ripple into the narrative. The tension should feel like it has escalated slightly from the previous beat. The location and time of day should evolve naturally.

You decide if the story should end based on narrative flow — a satisfying conclusion can happen anywhere from turn 4 onward. At tension 8-10 an ending feels natural.

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
    "carry forward all existing consequences plus add any new significant ones"
  ],
  "location": "Brief description of current location (5-8 words)",
  "timeOfDay": "morning | afternoon | evening | night",
  "tension": ${nextTension},
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