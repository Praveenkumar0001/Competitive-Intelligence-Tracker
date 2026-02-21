import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchWebContent } from '@/lib/fetcher'
import { generateDiff, hasSignificantChanges } from '@/lib/diff'
import { generateSummary } from '@/lib/openai'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  console.log('✅ check-all POST handler called')
  try {
    const body = await request.json()
    console.log('Request body:', body)
    const { competitorId } = body

    if (!competitorId) {
      console.log('❌ No competitorId provided')
      return NextResponse.json({ error: 'competitorId is required' }, { status: 400 })
    }

    console.log('🔍 Finding links for competitor:', competitorId)
    const links = await prisma.link.findMany({
      where: { competitorId },
      include: {
        checks: {
          orderBy: { checkDate: 'desc' },
          take: 1,
        },
      },
    })

    console.log('📊 Found links:', links.length)
    if (links.length === 0) {
      console.log('⚠️ No links found')
      return NextResponse.json({ error: 'No links found for this competitor' }, { status: 404 })
    }

    const results = []

    for (const link of links) {
      let content = ''
      let textContent = ''
      let status = 'success'
      let errorMsg = null

      try {
        const result = await fetchWebContent(link.url)
        content = result.html
        textContent = result.text
      } catch (error: any) {
        status = 'error'
        errorMsg = error.message
      }

      const check = await prisma.check.create({
        data: {
          linkId: link.id,
          content,
          textContent,
          status,
          errorMsg,
        },
      })

      if (status === 'success' && link.checks.length > 0) {
        const previousCheck = link.checks[0]
        const diffText = generateDiff(previousCheck.textContent, textContent)
        
        if (diffText !== 'No changes detected') {
          const hasSignificant = hasSignificantChanges(diffText)
          
          try {
            const { summary, snippets } = await generateSummary(
              previousCheck.textContent,
              textContent,
              diffText,
              link.url
            )

            await prisma.change.create({
              data: {
                checkId: check.id,
                diffText,
                summary,
                hasSignificant,
                snippets: JSON.stringify(snippets),
              },
            })
          } catch (error) {
            await prisma.change.create({
              data: {
                checkId: check.id,
                diffText,
                hasSignificant,
              },
            })
          }
        }
      }

      results.push({ linkId: link.id, checkId: check.id, status })
    }

    console.log('✅ All checks completed:', results.length)
    return NextResponse.json({ results, message: 'All checks completed' })
  } catch (error: any) {
    console.error('❌ Error in check-all:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
