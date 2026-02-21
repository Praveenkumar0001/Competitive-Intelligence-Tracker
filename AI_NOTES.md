# AI Usage Notes

## What AI Was Used For

### Code Generation (95% AI-assisted)
- **Complete application scaffolding**: Generated the entire Next.js project structure, including TypeScript configuration, Tailwind setup, and Prisma schema
- **API routes**: All REST API endpoints for competitors, links, checks, alerts, and status were AI-generated
- **Frontend components**: The entire React UI including the home page and status page was created with AI assistance
- **Library integrations**: AI helped integrate OpenAI, Prisma, Cheerio, and the diff library
- **Docker configuration**: Dockerfile and docker-compose.yml were AI-generated

### What I Checked Myself

✅ **Code Review**: Reviewed all generated code for correctness and best practices
✅ **Logic Validation**: Verified the diff algorithm and change detection logic
✅ **API Structure**: Ensured REST API follows proper conventions and error handling
✅ **Database Schema**: Validated relationships and cascade delete behavior in Prisma
✅ **UI/UX Flow**: Tested user workflows and edge cases
✅ **TypeScript Types**: Confirmed type safety across the application
✅ **Environment Variables**: Verified proper configuration management
✅ **Error Handling**: Added proper try-catch blocks and user-friendly error messages

## LLM Provider & Model Choice

### Providers Supported: Groq (Primary) OR OpenAI

**Primary: Groq with Llama-3.1-70B**
**Alternative: OpenAI with GPT-3.5-turbo**

### Why Groq (Recommended)?

1. **100% FREE**: Groq offers a generous free tier that's perfect for this use case
   - 30 requests per minute
   - 14,400 requests per day
   - Zero cost!

2. **Lightning Fast**: Groq's LPU inference is incredibly fast
   - Sub-second response times
   - Much faster than OpenAI for similar quality

3. **Powerful Model**: Llama-3.1-70B is a state-of-the-art open-source model
   - Excellent at summarization
   - Great at following JSON formatting instructions
   - Comparable quality to GPT-3.5-turbo

4. **Easy Integration**: Uses OpenAI-compatible API
   - Drop-in replacement
   - Same request/response format

### Why OpenAI Alternative?

1. **Battle-Tested**: OpenAI has proven reliability at scale

2. **Fallback Option**: If you need more than Groq's free tier

3. **Cost-Effective** (compared to GPT-4): GPT-3.5-turbo is still reasonably priced
   - ~$0.002 per 1K tokens vs GPT-4 at ~$0.03

### Alternatives Considered

- **GPT-4**: Better quality but expensive and overkill for summarization
- **Claude (Anthropic)**: Great quality but no free tier
- **Google Gemini**: Free tier available but less proven for this use case
- **Self-hosted (Ollama)**: Free but requires local resources and setup

### Why This Dual Approach?

**Best of both worlds:**
- **Groq FREE tier** is perfect for personal use, testing, and small teams
- **OpenAI** available when you need more capacity or want proven reliability  
- Users can choose based on their needs and budget

For a competitive intelligence tracker, **Groq's free tier is ideal** because:
- Checks happen sporadically (not continuous)
- 14,400 requests/day is more than enough
- Zero ongoing costs
- Excellent quality for summarization tasks

### How It Works

The app automatically detects which API key you've configured:
```typescript
const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
const model = process.env.GROQ_API_KEY ? 'llama-3.1-70b-versatile' : 'gpt-3.5-turbo'
```

Groq takes priority if both keys are present. The application can easily support other providers by updating `/lib/openai.ts`.

## AI Development Workflow

1. **Initial Prompt**: Provided full requirements to generate project structure
2. **Iterative Refinement**: Made adjustments to improve error handling and UX
3. **Feature Addition**: Used AI to add tags, alerts, and filtering features
4. **Testing**: Manually tested all features and fixed edge cases
5. **Documentation**: AI-assisted in creating comprehensive documentation

## Confidence Level

I am **highly confident** in this codebase because:
- All critical paths have been reviewed
- Error handling is comprehensive
- Types are properly defined in TypeScript
- Database schema has proper constraints
- UI handles loading and error states correctly
- Docker configuration has been validated
