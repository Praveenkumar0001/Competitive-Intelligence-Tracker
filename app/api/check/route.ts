import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchWebContent } from '@/lib/fetcher'
import { generateDiff, hasSignificantChanges } from '@/lib/diff'
import { generateSummary } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { linkId } = body

    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 })
    }

    const link = await prisma.link.findUnique({
      where: { id: linkId },
      include: {
        checks: {
          orderBy: { checkDate: 'desc' },
          take: 1,
        },
      },
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Fetch new content
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

    // Create the check
    const check = await prisma.check.create({
      data: {
        linkId,
        content,
        textContent,
        status,
        errorMsg,
      },
    })

    // If successful and there's a previous check, generate diff and summary
    if (status === 'success' && link.checks.length > 0) {
      const previousCheck = link.checks[0]
      const diffText = generateDiff(previousCheck.textContent, textContent)
      
      // Only generate summary if there are changes
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
          // Create change without summary if LLM fails
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

    return NextResponse.json({ check, message: 'Check completed successfully' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
