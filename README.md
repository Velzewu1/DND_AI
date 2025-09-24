# 🎲 DND AI - Dungeons & Dragons Content Generator

AI-powered web application for generating D&D content including maps, stories, and characters.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Fal.ai API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd DND_AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Add your API keys to `.env.local`**
```env
OPENAI_API_KEY=your_openai_api_key_here
FAL_KEY=your_fal_ai_key_here
```

5. **Start the development server**
```bash
npm run dev
```

6. **Start the local API server** (in a new terminal)
```bash
node server-local.js
```

7. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
DND_AI/
├── src/
│   ├── components/          # React components
│   ├── sections/           # Main app sections
│   ├── utils/              # Utility functions
│   └── config.js           # API configuration
├── api/                    # Vercel serverless functions
├── server-local.js         # Local development server
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔧 API Endpoints

- `POST /api/generate-dnd-prompt` - Generate D&D stories
- `POST /api/generate-character` - Generate character descriptions
- `POST /api/generate-character-image` - Generate character portraits
- `POST /api/generate-map-image` - Generate stylized maps

## 🎨 Features

- **Procedural Map Generation** - Perlin noise-based terrain
- **AI Map Stylization** - Image-to-image with Fal.ai
- **Story Generation** - GPT-3.5 powered scenarios
- **Character Creation** - Detailed NPCs with portraits
- **Responsive Design** - Works on all devices

## 🚀 Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
- `OPENAI_API_KEY`
- `FAL_KEY`

## 🔑 API Keys Setup

### OpenAI
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Add to environment variables

### Fal.ai
1. Go to [Fal.ai](https://fal.ai/)
2. Create account and get API key
3. Add to environment variables

## 🐛 Troubleshooting

- **404 errors**: Make sure local server is running on port 3001
- **API errors**: Check API keys are correctly set
- **Build errors**: Clear node_modules and reinstall dependencies

## 📝 License

MIT License - see LICENSE file for details