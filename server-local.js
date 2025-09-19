// Local development server for testing API endpoints
import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Import our API handlers
async function handleDndPrompt(req, res) {
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
      ]
    };

    const templates = promptTemplates[promptType] || promptTemplates.story;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

    const setting = config.setting || getRandomSetting();
    const partySize = config.partySize || (Math.floor(Math.random() * 4) + 3);
    const level = config.level || (Math.floor(Math.random() * 15) + 3);

    const filledPrompt = randomTemplate
      .replace(/{setting}/g, setting)
      .replace(/{partySize}/g, partySize)
      .replace(/{level}/g, level);

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
      temperature: 0.9,
      top_p: 0.95,
      frequency_penalty: 0.3,
      presence_penalty: 0.4
    });

    const generatedContent = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      content: generatedContent,
      promptType: promptType,
      config: { setting, partySize, level, template: randomTemplate },
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

async function handleCharacterGeneration(req, res) {
  try {
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { characterType = 'npc', config = {} } = req.body;

    const prompt = `Create a memorable D&D NPC with the following details:
    - Setting: ${config.setting || 'a fantasy tavern'}
    - Role: ${config.role || 'innkeeper'}
    - Race: ${config.race || 'human'}
    - Name: ${config.name || 'Unnamed'}
    
    Include: name, appearance, personality, backstory, goals, and how they might interact with adventurers.`;

    const systemPrompt = `You are an expert D&D character creator with decades of experience. Create vivid, three-dimensional characters that feel real and engaging.

Guidelines:
- Make characters feel alive with specific details
- Include both strengths and flaws
- Give them clear motivations and goals
- Add interesting quirks or mannerisms
- Make them memorable and unique
- Include practical game information
- Length: Medium response (3-4 paragraphs)
- Avoid clichés and overused tropes`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.85,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.4
    });

    const generatedCharacter = completion.choices[0].message.content;

    res.status(200).json({
      success: true,
      content: generatedCharacter,
      characterType: characterType,
      config: config
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

async function handleCharacterImageGeneration(req, res) {
  try {
    const { OpenAI } = await import('openai');
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { character = {}, style = "fantasy_realistic", quality = "standard", size = "1024x1024" } = req.body;

    // Build detailed prompt for DALL-E
    const race = character.race || 'human';
    const characterClass = character.class || 'fighter';
    const culture = character.culture || 'northern';
    const name = character.name || 'Unnamed Hero';
    const traits = character.traits?.filter(t => t.trim()).join(', ') || '';
    const items = character.items?.filter(i => i.trim()).join(', ') || '';

    // Create a detailed, artistic prompt for DALL-E
    let prompt = `A detailed fantasy character portrait of ${name}, a ${race} ${characterClass} from the ${culture} lands. `;
    
    // Add physical description based on race
    const raceDescriptions = {
      human: "with realistic human features",
      elf: "with pointed ears, elegant features, and an ethereal appearance",
      dwarf: "with a sturdy build, braided beard, and weathered hands",
      halfling: "with a small stature, cheerful expression, and nimble appearance",
      orc: "with green skin, prominent tusks, and muscular build",
      tiefling: "with horns, a tail, and demonic heritage features"
    };
    prompt += raceDescriptions[race] || raceDescriptions.human;

    // Add class-specific elements
    const classElements = {
      fighter: "wearing sturdy armor and carrying weapons",
      wizard: "wearing robes and holding a magical staff or spellbook",
      rogue: "wearing dark leather armor with daggers and lockpicks",
      cleric: "wearing holy symbols and divine vestments",
      ranger: "wearing practical outdoor gear with a bow and nature elements",
      barbarian: "wearing minimal armor showing tribal tattoos and scars"
    };
    prompt += `, ${classElements[characterClass] || classElements.fighter}`;

    // Add cultural elements
    const culturalStyles = {
      northern: "with Nordic/Viking aesthetic, furs and cold weather gear",
      eastern: "with Asian-inspired clothing and ornate designs",
      southern: "with Mediterranean/desert styling and flowing fabrics",
      western: "with frontier/cowboy elements and practical gear",
      nomadic: "with travel-worn equipment and multicultural influences",
      urban: "with sophisticated city clothing and refined accessories"
    };
    prompt += `, ${culturalStyles[culture] || culturalStyles.northern}`;

    // Add traits and items if provided
    if (traits) {
      prompt += `. Character traits: ${traits}`;
    }
    if (items) {
      prompt += `. Notable equipment: ${items}`;
    }

    // Add style-specific specifications
    const stylePrompts = {
      fantasy_realistic: ". Digital art, fantasy character portrait, detailed, professional artwork, dramatic lighting, rich colors, high quality, fantasy RPG character art style.",
      pixel_art: ". Strict pixel art style, 16-bit retro game character sprite, perfect pixel alignment, limited color palette, classic JRPG aesthetic, sharp geometric pixels, no anti-aliasing, no gradients, blocky pixelated style, retro gaming art.",
      anime: ". Anime art style, manga character design, cel-shaded, vibrant colors, expressive eyes, Japanese animation aesthetic.",
      oil_painting: ". Oil painting style, classical art technique, rich textures, masterful brushwork, museum quality, renaissance portrait style.",
      sketch: ". Pencil sketch, hand-drawn, detailed line art, graphite shading, artistic sketch style, black and white.",
      dark_gothic: ". Dark gothic art style, dramatic shadows, mysterious atmosphere, dark fantasy aesthetic, haunting beauty.",
      cyberpunk: ". Cyberpunk art style, neon colors, futuristic elements, high-tech fantasy fusion, glowing effects, dystopian aesthetic."
    };
    
    prompt += stylePrompts[style] || stylePrompts.fantasy_realistic;

    console.log('🎨 Generating image with prompt:', prompt);

    console.log(`🎨 Settings: Style=${style}, Quality=${quality}, Size=${size}`);

    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: size,
      quality: quality,
      n: 1,
    });

    const imageUrl = imageResponse.data[0].url;
    const revisedPrompt = imageResponse.data[0].revised_prompt;

    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      originalPrompt: prompt,
      revisedPrompt: revisedPrompt,
      character: character
    });

  } catch (error) {
    console.error('DALL-E API Error:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      type: error.type || 'unknown_error'
    });
  }
}

// API routes
app.post('/api/generate-dnd-prompt', handleDndPrompt);
app.post('/api/generate-character', handleCharacterGeneration);
app.post('/api/generate-character-image', handleCharacterImageGeneration);

// Helper function
function getRandomSetting() {
  const settings = [
    "a haunted forest where the trees whisper ancient secrets",
    "an underground dwarven city carved into a massive geode",
    "a floating island chain connected by magical bridges",
    "a desert oasis hiding a portal to the Feywild",
    "a coastal town where the tide reveals different realities"
  ];
  return settings[Math.floor(Math.random() * settings.length)];
}

app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/generate-dnd-prompt`);
  console.log(`   POST http://localhost:${PORT}/api/generate-character`);
  console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? '✅ Loaded' : '❌ Missing'}`);
});
