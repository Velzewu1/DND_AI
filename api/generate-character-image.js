// Vercel serverless function for generating D&D character images
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
