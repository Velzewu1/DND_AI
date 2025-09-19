// Test pixel art style generation
import fetch from 'node-fetch';

async function testPixelArt() {
  try {
    console.log('🎮 Testing pixel art generation...');
    
    const testCharacter = {
      name: "Pixel Hero",
      race: "human",
      class: "wizard",
      culture: "eastern",
      traits: ["wise", "mysterious"],
      items: ["magic staff", "ancient tome"],
      fraction: "order"
    };
    
    const response = await fetch('http://localhost:3001/api/generate-character-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: testCharacter,
        style: "pixel_art"
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Pixel Art Test Successful!');
      console.log('🖼️ Image URL:', data.imageUrl);
      console.log('📝 Style prompt:', data.originalPrompt.substring(data.originalPrompt.indexOf('Pixel art')));
    } else {
      console.log('❌ Pixel Art Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
  }
}

testPixelArt();
