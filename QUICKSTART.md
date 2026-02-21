# Quick Start Guide

Follow these steps to get the Competitive Intelligence Tracker running on your machine.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- An OpenAI API key (get one at https://platform.openai.com/api-keys)

## Setup (5 minutes)

### Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

### Step 2: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-your-actual-openai-api-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Initialize Database

```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 4: Run the App

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

## Using the App

1. **Add a Competitor**
   - Click "Add Competitor" button
   - Enter name (e.g., "Acme Corp"), description, and tags

2. **Add Links**
   - Click "Add Link" under the competitor
   - Paste a URL (e.g., https://example.com/pricing)
   - Select link type (pricing, docs, changelog)
   - You can add up to 10 links per competitor

3. **Run First Check**
   - Click the green "Check Now" button
   - This fetches and stores the current content
   - First check establishes a baseline

4. **Run Second Check (to see changes)**
   - Wait a moment or make changes to the competitor's page
   - Click "Check Now" again
   - You'll now see diffs and AI-generated summaries!

5. **View History**
   - Click "View History" to see last 5 checks
   - See what changed, when, and AI summaries with citations

6. **Add Alerts**
   - Click "Add Alert" to monitor keywords
   - Example: Track when "pricing" or "discount" appears

7. **Filter Changes**
   - Check "Show only significant changes" to focus on major updates

## Testing the App

Try these competitors to test:

- **Vercel Pricing**: https://vercel.com/pricing
- **OpenAI Changelog**: https://help.openai.com/en/articles/6825453-chatgpt-release-notes
- **GitHub Features**: https://github.com/features

## Check System Status

Visit [http://localhost:3000/status](http://localhost:3000/status) to verify:
- ✅ Backend server is running
- ✅ Database is connected
- ✅ OpenAI API is working

## Troubleshooting

**"OpenAI API Error"**
- Check your OPENAI_API_KEY in .env file
- Ensure you have API credits in your OpenAI account
- The app will still work, but won't generate AI summaries

**"Failed to fetch"**
- Some websites block scraping - this is normal
- Try a different URL
- Check if the website requires authentication

**Database errors**
- Delete `prisma/dev.db` and run `npx prisma migrate deploy` again
- Make sure you ran `npx prisma generate`

## Docker Alternative

If you prefer Docker:

```bash
# Build and run
docker-compose up

# Access at http://localhost:3000
```

## Next Steps

- Check out [README.md](README.md) for full documentation
- Read [AI_NOTES.md](AI_NOTES.md) to understand the AI integration
- See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting instructions

---

**Need Help?**
- Review the [README.md](README.md) for detailed information
- Check the status page at `/status`
- Ensure all environment variables are set correctly
