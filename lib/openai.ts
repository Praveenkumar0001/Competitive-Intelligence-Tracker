import OpenAI from 'openai'

// Support both OpenAI and Groq (free alternative)
const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || ''
const baseURL = process.env.GROQ_API_KEY 
  ? 'https://api.groq.com/openai/v1' 
  : undefined

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
})

export async function generateSummary(
  oldContent: string,
  newContent: string,
  diffText: string,
  url: string
): Promise<{ summary: string; snippets: Array<{ text: string; citation: string }> }> {
  try {
    const prompt = `You are analyzing changes to a competitor's webpage.
    
URL: ${url}

The page has changed. Here's the diff (showing additions with + and removals with -):
${diffText.slice(0, 3000)}

Based on these changes, provide:
1. A concise summary (2-3 sentences) of what changed
2. Extract 2-3 important snippets with their context

Format your response as JSON:
{
  "summary": "Brief summary of changes",
  "snippets": [
    {"text": "Important snippet", "citation": "Context about where this appears"}
  ]
}`;

    const model = process.env.GROQ_API_KEY 
      ? 'llama-3.3-70b-versatile'  // Free Groq model (updated)
      : 'gpt-3.5-turbo'             // OpenAI model

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: 'You are a competitive intelligence analyst. Respond only with valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0]?.message?.content || '{}'
    const parsed = JSON.parse(content)
    
    return {
      summary: parsed.summary || 'Changes detected but summary unavailable',
      snippets: parsed.snippets || [],
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return {
      summary: 'Unable to generate AI summary. Changes detected.',
      snippets: [],
    }
  }
}

export async function checkLLMConnection(): Promise<boolean> {
  // Quick check if API key is configured
  const hasGroq = process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your-groq-api-key-here'
  const hasOpenAI = process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here'
  
  if (!hasGroq && !hasOpenAI) {
    return false
  }

  try {
    // Create a timeout promise to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Health check timeout')), 5000)
    })

    // Select model based on provider
    const model = hasGroq ? 'llama-3.3-70b-versatile' : 'gpt-3.5-turbo'

    // Race between the API call and timeout
    const apiPromise = openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: 'test' }],
      max_tokens: 5,
    })

    const response = await Promise.race([apiPromise, timeoutPromise])
    return !!response.choices[0]
  } catch (error) {
    console.error('LLM health check failed:', error)
    return false
  }
}
