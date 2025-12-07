# MemoryTool Web

AI-powered spaced repetition learning tool to help you remember names and faces.

## Features

- 📸 **Upload Photos** - Add photos of people you want to remember
- 🤖 **AI Memory Aids** - Claude AI generates creative mnemonics based on appearance and name
- 🧠 **Spaced Repetition** - SM-2 algorithm optimizes review intervals
- 📊 **Progress Tracking** - Track your review history and statistics
- 💾 **Local Storage** - All data stored safely in your browser
- 📱 **Responsive Design** - Works on desktop and mobile

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Claude API key (get free from https://console.anthropic.com)

### Installation
```bash
npm install
```

### Configuration

Create `.env.local` in the project root:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
ANTHROPIC_API_KEY=your_claude_api_key_here
```

### Running Locally
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Usage

1. **Add Person**: Click "Add Person" tab
   - Enter name
   - Upload a photo
   - Click "Generate Memory Aid"
   - Claude creates a memorable mnemonic
   - Click "Add to Cards"

2. **Review**: Click "Review" tab
   - See a photo
   - Try to recall the person's name
   - Click "Show Memory Aid" if needed
   - Rate how well you remembered (Forgot, Unsure, Good, Perfect)
   - System adjusts next review date

3. **Library**: Click "Library" tab
   - See all your cards
   - Click a card for detailed stats
   - Delete cards if needed

## How It Works

### SM-2 Algorithm
The app uses the SuperMemo 2 (SM-2) algorithm for spaced repetition:
- Cards start with 1-day intervals
- Based on your recall quality, intervals increase exponentially
- Forgotten cards reset to 1-day interval
- Ease factor adjusts based on performance

### Claude AI Integration
- **Image Analysis**: Claude vision API describes appearance
- **Mnemonic Generation**: Creates memorable phrases combining name + appearance

## Technology Stack

- **Frontend**: React 18, Next.js 15, TypeScript
- **State Management**: Zustand
- **Styling**: CSS Modules
- **API**: Anthropic Claude 3.5 Sonnet
- **Storage**: Browser localStorage
- **Deployment**: Vercel

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Click Deploy

Your app will be live in 2-3 minutes!

## Costs

- **Hosting**: Free (Vercel free tier)
- **Claude API**: ~$0.003 per card (analysis + mnemonic generation)
- **Typical usage**: $1-5/month for active users
- **New accounts**: $100 free credits on Claude API

## Tips for Best Results

- Use clear, well-lit photos
- Include distinctive features (glasses, unique hairstyles, etc.)
- Review cards regularly for better retention
- Rate yourself honestly for accurate scheduling

## License

MIT

## Support

For issues or questions, check the Claude documentation:
- https://docs.anthropic.com
- https://support.anthropic.com
