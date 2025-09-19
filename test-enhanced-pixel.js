// Test enhanced pixel art with HD quality
import fetch from 'node-fetch';

async function testEnhancedPixelArt() {
  try {
    console.log('🎮 Testing enhanced pixel art with HD quality...');
    
    const testCharacter = {
      name: "Pixel Warrior",
      race: "dwarf",
      class: "barbarian",
      culture: "northern",
      traits: ["fierce", "battle-scarred"],
      items: ["war axe", "iron shield"],
      fraction: "clan"
    };
    
    const response = await fetch('http://localhost:3001/api/generate-character-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: testCharacter,
        style: "pixel_art",
        quality: "hd",
        size: "1024x1024"
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Enhanced Pixel Art Test Successful!');
      console.log('🖼️ HD Image URL:', data.imageUrl);
      console.log('🎨 Style:', data.originalPrompt.includes('Strict pixel art') ? 'Enhanced Pixel Art ✓' : 'Standard');
    } else {
      console.log('❌ Enhanced Pixel Art Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
  }
}

testEnhancedPixelArt();
