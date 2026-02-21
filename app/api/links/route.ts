import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitorId, url, linkType } = body

    if (!competitorId || !url || !linkType) {
      return NextResponse.json(
        { error: 'competitorId, url, and linkType are required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const link = await prisma.link.create({
      data: {
        url,
        linkType,
        competitorId,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const competitorId = searchParams.get('competitorId')

    if (!competitorId) {
      return NextResponse.json({ error: 'competitorId is required' }, { status: 400 })
    }

    const links = await prisma.link.findMany({
      where: { competitorId },
      include: {
        checks: {
          orderBy: { checkDate: 'desc' },
          take: 5,
        },
      },
    })

    return NextResponse.json(links)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
