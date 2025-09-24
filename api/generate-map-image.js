import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { mapDescription, style, genre, terrainType, mapPNG } = req.body;

  try {
    const prompt = `Create a ${style} style ${genre} ${terrainType} map. 
      ${style === 'dungeon' ? 'Dark underground corridors, stone walls, torch-lit passages, secret rooms, traps, and treasure chambers. Isometric view of a dungeon layout.' : 
        style === 'overworld' ? 'Fantasy world map with kingdoms, forests, mountains, rivers, and cities. Medieval cartography style.' :
        style === 'city' ? 'Urban fantasy city map with streets, buildings, districts, and landmarks. City planning layout.' :
        style === 'wilderness' ? 'Untamed wilderness map with forests, rivers, mountains, and natural features. Nature-focused cartography.' :
        style === 'underground' ? 'Underground cavern system with natural rock formations, underground rivers, and cave networks.' :
        'Otherworldly planar map with floating islands, magical portals, and ethereal landscapes.'}
      ${terrainType === 'archipelago' ? 'Multiple scattered islands of varying sizes across the sea.' :
        terrainType === 'continent' ? 'Large connected landmass with diverse terrain features.' :
        'Two separate continents with distinct geographical features.'}
      Professional fantasy cartography, detailed, high quality, dark atmosphere, 
      NOT a real world map, NOT Earth, fantasy setting only.`;

    if (!mapPNG) {
      throw new Error('No PNG map provided for img2img');
    }
    const result = await fal.subscribe("fal-ai/qwen-image-edit-plus", {
      input: {
        prompt: prompt,
        image_urls: [mapPNG],
        image_size: "square_hd",
        num_inference_steps: 50,
        guidance_scale: 4,
        num_images: 1,
        enable_safety_checker: true,
        output_format: "png"
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.map((log) => log.message).forEach(console.log);
        }
      },
    });
    
    res.json({ 
      success: true,
      imageUrl: result.data.images[0].url,
      requestId: result.requestId 
    });

  } catch (error) {
    console.error('Error generating map image:', error);
    res.status(500).json({ 
      error: 'Failed to generate map image',
      details: error.message 
    });
  }
}
