import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkLLMConnection } from '@/lib/openai'

export async function GET() {
  const status = {
    backend: 'healthy',
    database: 'healthy',
    llm: 'healthy',
    timestamp: new Date().toISOString(),
  }

  try {
    // Check database
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    status.database = 'unhealthy'
  }

  try {
    // Check LLM
    const llmOk = await checkLLMConnection()
    if (!llmOk) {
      status.llm = 'unhealthy'
    }
  } catch (error) {
    status.llm = 'unhealthy'
  }

  const allHealthy = status.backend === 'healthy' && 
                     status.database === 'healthy' && 
                     status.llm === 'healthy'

  return NextResponse.json(status, { status: allHealthy ? 200 : 503 })
}
