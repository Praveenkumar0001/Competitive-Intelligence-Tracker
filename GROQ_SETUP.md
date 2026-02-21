# 🆓 FREE LLM Setup with Groq

## Why Groq?
- ✅ **100% FREE** - Generous free tier
- ✅ **Super Fast** - Lightning-fast inference
- ✅ **Powerful** - Llama 3.1 70B model
- ✅ **Easy** - Compatible API with OpenAI

## Quick Setup (2 minutes)

### Step 1: Get Your FREE Groq API Key

1. Go to: **https://console.groq.com**
2. Sign up (Google/GitHub login available)
3. Navigate to: **API Keys** section
4. Click **"Create API Key"**
5. Copy your key (starts with `gsk_...`)

### Step 2: Add to Your .env File

Open `.env` and replace the Groq key:

```bash
GROQ_API_KEY="gsk_your_actual_key_here"
```

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then start again:
npm run dev
```

### Step 4: Verify

Visit: **http://localhost:3000/status**

You should see:
- ✅ Backend Server: **healthy**
- ✅ Database: **healthy**
- ✅ LLM Connection: **healthy** (Groq Llama-3.1-70B)

## How It Works

The app now automatically detects which API key you have:
- If `GROQ_API_KEY` is set → Uses **Groq Llama-3.1-70B** (FREE)
- If `OPENAI_API_KEY` is set → Uses **OpenAI GPT-3.5-turbo** (Paid)
- Groq takes priority if both are set

## Free Tier Limits

**Groq Free Tier:**
- 30 requests per minute
- 14,400 requests per day
- More than enough for this app!
- Using Llama 3.3 70B (latest model)

**Perfect for:**
- Testing and development
- Personal use
- Small teams
- Competitive intelligence tracking

## Need More?

If you need more capacity or want to use OpenAI instead:
1. Get OpenAI key at: https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY="sk-..."`
3. Remove or comment out the `GROQ_API_KEY` line

## Troubleshooting

**Still showing unhealthy?**
- Make sure you restarted the server after adding the key
- Check the key starts with `gsk_`
- Verify no extra spaces in the `.env` file

**Groq account suspended?**
- Use a different email to create a new account
- Or switch to OpenAI (paid)

---

**Ready to track competitors with FREE AI summaries!** 🚀
