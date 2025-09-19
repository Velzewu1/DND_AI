// Vercel serverless function for generating D&D prompts
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

    const { promptType = 'story', config = {} } = req.body;

    // High randomness D&D prompt templates
    const promptTemplates = {
      story: [
        "Create a mysterious D&D adventure involving an ancient artifact that's been discovered in {setting}. Include unexpected plot twists, memorable NPCs, and challenging encounters suitable for a party of {partySize} level {level} characters.",
        "Generate a thrilling D&D quest where the party must investigate strange disappearances in {setting}. Add supernatural elements, political intrigue, and moral dilemmas that will test the characters.",
        "Design a D&D adventure centered around a magical phenomenon affecting {setting}. Include environmental hazards, unique creatures, and opportunities for both combat and roleplay.",
        "Create a D&D scenario where the party discovers a hidden conspiracy in {setting}. Add layers of deception, powerful enemies, and unexpected allies.",
        "Generate a D&D adventure involving time magic or dimensional travel affecting {setting}. Include paradoxes, alternate versions of familiar places, and reality-bending challenges."
      ],
      character: [
        "Create a complex D&D NPC with a dark secret and conflicting motivations. They should be from {setting} and have connections to both the party's allies and enemies.",
        "Generate a memorable D&D villain with understandable motivations and a tragic backstory. They operate in {setting} and have a personal connection to one of the party members.",
        "Design a quirky D&D merchant or innkeeper with magical abilities they try to hide. They're located in {setting} and have valuable information about the local area.",
        "Create a powerful D&D ally who can help the party but demands a significant price for their assistance. They have deep knowledge of {setting}'s history and secrets.",
        "Generate a mysterious D&D figure who appears throughout the campaign, offering cryptic advice and warnings. Their true identity and motives remain unclear."
      ],
      encounter: [
        "Design a D&D combat encounter in {setting} that involves environmental hazards and requires tactical thinking beyond just attacking enemies.",
        "Create a D&D social encounter where the party must navigate complex political relationships and competing interests in {setting}.",
        "Generate a D&D puzzle encounter that combines magical elements with logical thinking, set in an ancient location within {setting}.",
        "Design a D&D stealth encounter where the party must infiltrate a heavily guarded location in {setting} without being detected.",
        "Create a D&D chase scene through the dangerous terrain of {setting}, with obstacles, shortcuts, and unexpected complications."
      ]
    };

    // Random template selection for high variability
    const templates = promptTemplates[promptType] || promptTemplates.story;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    // Fill in template variables with config or random defaults
    const setting = config.setting || getRandomSetting();
    const partySize = config.partySize || (Math.floor(Math.random() * 4) + 3); // 3-6 players
    const level = config.level || (Math.floor(Math.random() * 15) + 3); // Level 3-17

    const filledPrompt = randomTemplate
      .replace(/{setting}/g, setting)
      .replace(/{partySize}/g, partySize)
      .replace(/{level}/g, level);

    // System prompt for high creativity and randomness
    const systemPrompt = `You are an expert D&D Dungeon Master with decades of experience creating engaging, unpredictable adventures. 

Key guidelines:
- Be highly creative and avoid clichés
- Include unexpected twists and unique elements
- Create vivid, immersive descriptions
- Add specific details that bring the world to life
- Include both combat and roleplay opportunities
- Make it memorable and exciting
- Length: Medium-sized response (3-5 paragraphs)
- Tone: Engaging and atmospheric

Generate content that feels fresh and original, avoiding overused tropes.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: filledPrompt }
      ],
      max_tokens: 800,
      temperature: 0.9, // High randomness
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.4
    });

    const generatedContent = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      content: generatedContent,
      promptType: promptType,
      config: {
        setting,
        partySize,
        level,
        template: randomTemplate
      },
      usage: completion.usage
    });

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    // Return detailed error for development
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
}

// Helper function for random settings
function getRandomSetting() {
  const settings = [
    "a haunted forest where the trees whisper ancient secrets",
    "an underground dwarven city carved into a massive geode",
    "a floating island chain connected by magical bridges",
    "a desert oasis hiding a portal to the Feywild",
    "a coastal town where the tide reveals different realities",
    "an ancient library that exists between dimensions",
    "a mountain monastery where time flows differently",
    "a swampland where the dead don't stay buried",
    "a crystal cave system that amplifies magical energy",
    "a ruined castle that rebuilds itself each dawn",
    "a merchant city built inside a massive dead dragon",
    "a frozen wasteland where aurora lights grant visions",
    "an enchanted garden that changes with the seasons",
    "a underground river system with bioluminescent creatures",
    "a sky city that travels between different worlds"
  ];
  
  return settings[Math.floor(Math.random() * settings.length)];
}
