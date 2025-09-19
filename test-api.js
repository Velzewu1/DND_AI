// Quick test of our local API
import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log('🧪 Testing local API server...');
    
    const response = await fetch('http://localhost:3001/api/generate-dnd-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        promptType: 'story',
        config: {
          setting: 'test haunted forest',
          complexity: 'medium'
        }
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API Test Successful!');
      console.log('📝 Generated content:', data.content.substring(0, 100) + '...');
    } else {
      console.log('❌ API Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection Error:', error.message);
    console.log('💡 Make sure the local API server is running: node server-local.js');
  }
}

testAPI();
