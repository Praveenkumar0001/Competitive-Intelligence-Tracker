# Competitive Intelligence Tracker

A web application to track competitor website changes with AI-powered summaries and detailed diff analysis.

## Features

✅ **Implemented**
- Add and manage multiple competitors (up to 5-10 links each)
- Track pricing pages, documentation, changelogs, and other pages
- One-click "Check Now" button to fetch and store content
- Automatic diff generation showing what changed since last check
- AI-powered summaries with citations and snippets (using OpenAI GPT-3.5)
- History of last 5 checks per competitor link
- Tag system for organizing competitors
- Keyword alerts to monitor specific changes
- "Changes that matter" filter for significant updates
- System status page showing backend, database, and LLM health
- Input validation and error handling
- Responsive, modern UI with dark mode support

## How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn
- FREE Groq API key (recommended) OR OpenAI API key

### Local Development

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API key:
   
   **Option 1: Groq (FREE - Recommended)**
   ```
   GROQ_API_KEY=gsk-your-key-here
   ```
   Get it at: https://console.groq.com/keys
   
   **Option 2: OpenAI (Paid)**
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
   Get it at: https://platform.openai.com/api-keys

4. **Initialize the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Using Docker

1. **Build and run with one command:**
   ```bash
   docker-compose up
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

2. **Set your API key** in `docker-compose.yml` before building, or pass it as environment variable:
   ```bash
   # For Groq (FREE)
   GROQ_API_KEY=your-key docker-compose up
   
   # Or for OpenAI (Paid)
   OPENAI_API_KEY=your-key docker-compose up
   ```

## Usage Guide

1. **Add a Competitor**: Click "Add Competitor" and enter name, description, and tags
2. **Add Links**: Add 5-10 links per competitor (pricing, docs, changelog, etc.)
3. **Check Now**: Click the green "Check Now" button to fetch current content
4. **View Changes**: After the second check, you'll see diffs and AI summaries
5. **Set Alerts**: Add keyword alerts to monitor specific terms
6. **Filter**: Use "Show only significant changes" to focus on major updates

## Tech Stack

- **Framework**: Next.js 14 (App Router) with TypeScript
- **Database**: SQLite with Prisma ORM
- **LLM**: Groq Llama-3.1-70B (FREE) or OpenAI GPT-3.5-turbo
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Web Scraping**: Axios + Cheerio
- **Diff Engine**: diff library

## What's Done

✅ Core functionality complete
✅ All 5 required features implemented
✅ Additional features: tags, alerts, significance filters
✅ Status page with health checks
✅ Input validation and error handling
✅ Responsive UI with dark mode
✅ Docker configuration
✅ Complete documentation

## What's Not Done

⚠️ **Future Enhancements** (not required for MVP):
- Email notifications for alerts
- Scheduled automatic checks (cron jobs)
- Export data to CSV/PDF
- Multiple simultaneous competitor checks
- Advanced diff visualization (side-by-side)
- User authentication and multi-user support
- Browser extension for one-click tracking
- Historical trend charts
- Webhook integrations

## Project Structure

```
competitive-intelligence-tracker/
├── app/
│   ├── api/              # API routes
│   ├── status/           # Status page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── lib/
│   ├── prisma.ts         # Database client
│   ├── openai.ts         # LLM integration
│   ├── fetcher.ts        # Web content fetcher
│   └── diff.ts           # Diff generation
├── prisma/
│   └── schema.prisma     # Database schema
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## License

MIT

## Author

See [ABOUTME.md](ABOUTME.md) for developer information.
