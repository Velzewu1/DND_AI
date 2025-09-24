# 🚀 DND AI - Setup Instructions

## Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Fal.ai API key

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
FAL_KEY=your_fal_ai_key_here
```

### 3. Start Development
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start API server
node server-local.js
```

### 4. Open Browser
Navigate to `http://localhost:5173`

## API Keys Setup

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to `.env.local`

### Fal.ai
1. Go to [Fal.ai](https://fal.ai/)
2. Create account and get API key
3. Add to `.env.local`

## Troubleshooting

- **404 errors**: Make sure local server is running on port 3001
- **API errors**: Check API keys are correctly set
- **Build errors**: Clear node_modules and reinstall dependencies

## Production Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `OPENAI_API_KEY`
- `FAL_KEY`
