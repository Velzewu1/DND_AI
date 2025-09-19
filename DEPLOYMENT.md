# 🚀 DND AI - Vercel Deployment Guide

This guide will help you deploy your DND AI application with OpenAI integration to Vercel.

## 📋 Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **GitHub Repository**: Your code should be in a GitHub repository

## 🔧 Setup Steps

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# Copy the example and add your real API key
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 2. Test Locally

Before deploying, test your API endpoints locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` and test:
- **Story Generation**: Go to the Story section, enter a setting, and click "EXECUTE"
- **Character Generation**: Go to Characters section, configure a character, and click "🧠 AI BACKSTORY"

### 3. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it as a Vite project
5. Add environment variables in the deployment settings:
   - Key: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
6. Deploy!

#### Option B: Deploy via CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts and add environment variables when asked
```

### 4. Configure Environment Variables in Vercel

After deployment:
1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Environment Variables"
3. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environments**: Production, Preview, Development

### 5. Redeploy

After adding environment variables, trigger a new deployment:
- Push a new commit to your repository, OR
- Go to Vercel dashboard → Deployments → Redeploy

## 🧪 Testing Your Deployment

Once deployed, test these endpoints:

1. **Story Generation**:
   ```
   POST https://your-app.vercel.app/api/generate-dnd-prompt
   Content-Type: application/json
   
   {
     "promptType": "story",
     "config": {
       "setting": "haunted forest",
       "complexity": "medium"
     }
   }
   ```

2. **Character Generation**:
   ```
   POST https://your-app.vercel.app/api/generate-character
   Content-Type: application/json
   
   {
     "characterType": "npc",
     "config": {
       "setting": "tavern",
       "role": "innkeeper"
     }
   }
   ```

## 🔍 Troubleshooting

### Common Issues:

1. **"OpenAI API key not found"**
   - Check environment variables in Vercel dashboard
   - Ensure the key starts with `sk-`
   - Redeploy after adding variables

2. **CORS errors**
   - API routes include CORS headers
   - Check browser console for specific errors

3. **Function timeout**
   - OpenAI calls have 30-second timeout (configured in `vercel.json`)
   - Check Vercel function logs for errors

4. **Rate limiting**
   - OpenAI has usage limits based on your plan
   - Check your OpenAI usage dashboard

### Debug Steps:

1. Check Vercel function logs:
   - Go to Vercel dashboard → Functions → View logs

2. Test API endpoints directly:
   - Use Postman, curl, or browser dev tools

3. Check OpenAI usage:
   - Visit [OpenAI Usage Dashboard](https://platform.openai.com/usage)

## 🎮 Features Available

After successful deployment:

- ✅ **Story Generation**: AI-powered D&D adventure creation
- ✅ **Character Backstories**: Rich NPC and character generation
- ✅ **High Randomness**: Each generation is unique and creative
- ✅ **Multiple Prompts**: Various story and character types
- ✅ **Error Handling**: Graceful error messages and retry options

## 💰 Cost Considerations

- **Vercel**: Free tier includes serverless functions
- **OpenAI**: Pay-per-use pricing
  - GPT-3.5-turbo: ~$0.002 per 1K tokens
  - Average story generation: ~800 tokens (~$0.0016)
  - Average character generation: ~600 tokens (~$0.0012)

## 🔒 Security Notes

- ✅ API key stored securely in environment variables
- ✅ CORS configured for your frontend
- ✅ No API key exposure in client-side code
- ✅ Rate limiting handled by OpenAI

---

**Need help?** Check the Vercel documentation or OpenAI API docs for additional troubleshooting.
