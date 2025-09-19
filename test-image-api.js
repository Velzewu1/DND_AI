// Quick test of our image generation API
import fetch from 'node-fetch';

async function testImageAPI() {
  try {
    console.log('🎨 Testing image generation API...');
    
    const testCharacter = {
      name: "Thorin Stormbeard",
      race: "dwarf",
      class: "fighter",
      culture: "northern",
      traits: ["brave", "loyal"],
      items: ["enchanted axe", "dragon scale armor"],
      fraction: "clan"
    };
    
    const response = await fetch('http://localhost:3001/api/generate-character-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        character: testCharacter
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Image API Test Successful!');
      console.log('🖼️ Image URL:', data.imageUrl);
      console.log('📝 Original prompt:', data.originalPrompt.substring(0, 100) + '...');
    } else {
      console.log('❌ Image API Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('💡 Make sure the local API server is running: node server-local.js');
  }
}

testImageAPI();
