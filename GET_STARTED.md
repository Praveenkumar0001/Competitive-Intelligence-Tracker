# 🎯 Competitive Intelligence Tracker

**A complete web application to monitor competitor website changes with AI-powered analysis**

---

## ✨ What You Get

✅ Track 5-10 competitor links per company  
✅ Automatic change detection with diff visualization  
✅ AI-generated summaries with citations (OpenAI GPT-3.5)  
✅ History of last 5 checks per link  
✅ Tags, keyword alerts, and significance filters  
✅ System status dashboard  
✅ Docker-ready for one-command deployment  

---

## 🚀 Quick Start (3 steps)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Configure Your OpenAI API Key

Edit the `.env` file and replace with your actual API key:
```
OPENAI_API_KEY="sk-your-actual-key-here"
```

Get a key at: https://platform.openai.com/api-keys

### 3️⃣ Initialize & Run
```bash
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📖 Full Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide with examples
- **[README.md](README.md)** - Complete feature list and tech stack
- **[AI_NOTES.md](AI_NOTES.md)** - AI integration details and LLM choice
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Hosting instructions
- **[PROMPTS_USED.md](PROMPTS_USED.md)** - Development prompts

---

## 🐳 Docker Alternative

If you prefer Docker:
```bash
docker-compose up
```

---

## 📋 Usage

1. Click "Add Competitor" 
2. Add competitor links (pricing, docs, changelogs)
3. Click "Check Now" to fetch content
4. Run "Check Now" again later to see changes!
5. View AI summaries, diffs, and history

---

## 🛠️ Tech Stack

- Next.js 14 + TypeScript
- Prisma + SQLite  
- OpenAI GPT-3.5-turbo
- Tailwind CSS
- Docker

---

## ⚠️ Important Notes

**Before Submitting:**

1. ✏️ Update [ABOUTME.md](ABOUTME.md) with your name and resume
2. 🔑 Test with a valid OpenAI API key
3. ✅ Visit `/status` page to verify all systems are healthy
4. 🚀 Deploy to hosting (Vercel, Railway, etc.) or ensure Docker works

**If hosting is truly not possible:**
- Docker must work with `docker-compose up`
- Explain why hosting wasn't possible in submission notes
- Note: Hosted submissions score higher

---

## 📞 Need Help?

Check the [QUICKSTART.md](QUICKSTART.md) for troubleshooting or review the system status at `/status`.

---

Made with ❤️ for competitive intelligence tracking
