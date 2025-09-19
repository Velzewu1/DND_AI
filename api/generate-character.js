// Vercel serverless function for generating D&D characters
export default async function handler(req, res) {
  // Enable CORS for frontend requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { characterType = 'npc', config = {} } = req.body;

    // Character generation prompts with high randomness
    const characterPrompts = {
      npc: `Create a memorable D&D NPC with the following details:
      - Setting: ${config.setting || 'a fantasy tavern'}
      - Role: ${config.role || getRandomRole()}
      - Personality trait: ${getRandomPersonality()}
      - Secret or motivation: ${getRandomSecret()}
      
      Include: name, appearance, personality, backstory, goals, and how they might interact with adventurers.`,
      
      villain: `Design a compelling D&D villain for ${config.setting || 'a dark fantasy setting'}.
      - Power level: ${config.level || 'mid-tier threat'}
      - Motivation: ${getRandomVillainMotivation()}
      - Flaw: ${getRandomVillainFlaw()}
      
      Include: name, appearance, powers/abilities, backstory, goals, methods, and potential redemption arc.`,
      
      ally: `Create a helpful D&D ally character:
      - Setting: ${config.setting || 'adventuring party'}
      - Expertise: ${config.expertise || getRandomExpertise()}
      - Price for help: ${getRandomPrice()}
      
      Include: name, appearance, abilities, what they can offer, what they want in return, and personality quirks.`
    };

    const prompt = characterPrompts[characterType] || characterPrompts.npc;

    const systemPrompt = `You are an expert D&D character creator with decades of experience. Create vivid, three-dimensional characters that feel real and engaging.

Guidelines:
- Make characters feel alive with specific details
- Include both strengths and flaws
- Give them clear motivations and goals
- Add interesting quirks or mannerisms
- Make them memorable and unique
- Include practical game information (stats suggestions, role in story)
- Length: Medium response (3-4 paragraphs)
- Avoid clichés and overused tropes`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.85, // High creativity
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.4
    });

    const generatedCharacter = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      content: generatedCharacter,
      characterType: characterType,
      config: config,
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
}

// Helper functions for random character elements
function getRandomRole() {
  const roles = [
    'tavern keeper', 'blacksmith', 'merchant', 'guard captain', 'librarian',
    'street performer', 'noble', 'priest', 'spy', 'hermit', 'scholar',
    'bounty hunter', 'healer', 'guide', 'informant'
  ];
  return roles[Math.floor(Math.random() * roles.length)];
}

function getRandomPersonality() {
  const traits = [
    'overly curious about strangers', 'speaks only in questions',
    'collects unusual objects', 'has a photographic memory',
    'never removes their gloves', 'speaks to invisible companions',
    'always hungry', 'fears a specific color', 'compulsively honest',
    'remembers everyone they meet', 'hums constantly', 'counts everything'
  ];
  return traits[Math.floor(Math.random() * traits.length)];
}

function getRandomSecret() {
  const secrets = [
    'is actually nobility in hiding', 'owes a debt to a dangerous organization',
    'has prophetic dreams', 'is being hunted by their past',
    'knows the location of a lost treasure', 'is secretly a shapeshifter',
    'has a twin they never mention', 'was once a different profession entirely',
    'is immortal but pretends to age', 'has a magical curse',
    'is writing a book about local adventurers', 'has connections to the underworld'
  ];
  return secrets[Math.floor(Math.random() * secrets.length)];
}

function getRandomVillainMotivation() {
  const motivations = [
    'seeks to undo a past mistake', 'believes they are saving the world',
    'wants to prove their worth to someone', 'is driven by overwhelming grief',
    'seeks revenge for a betrayal', 'wants to reunite with a lost loved one',
    'believes the current order is corrupt', 'is trying to break a curse'
  ];
  return motivations[Math.floor(Math.random() * motivations.length)];
}

function getRandomVillainFlaw() {
  const flaws = [
    'too trusting of subordinates', 'obsessed with a particular ritual',
    'cannot resist a challenge', 'has a code of honor they follow',
    'is terrified of a specific thing', 'always gives opponents one chance',
    'becomes reckless when angry', 'has a soft spot for innocents'
  ];
  return flaws[Math.floor(Math.random() * flaws.length)];
}

function getRandomExpertise() {
  const expertise = [
    'ancient languages', 'monster lore', 'underground networks',
    'magical items', 'political intrigue', 'survival skills',
    'historical knowledge', 'criminal contacts', 'divine magic',
    'planar travel', 'alchemy', 'beast handling'
  ];
  return expertise[Math.floor(Math.random() * expertise.length)];
}

function getRandomPrice() {
  const prices = [
    'a favor to be named later', 'information about their enemies',
    'a rare component for their research', 'protection for their family',
    'help with a personal quest', 'a magical item they desire',
    'clearing their name of a crime', 'revenge against a rival'
  ];
  return prices[Math.floor(Math.random() * prices.length)];
}
