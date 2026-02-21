import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const competitors = await prisma.competitor.findMany({
      include: {
        links: {
          include: {
            checks: {
              orderBy: { checkDate: 'desc' },
              take: 1,
            },
          },
        },
        alerts: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(competitors)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, tags } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Competitor name is required' }, { status: 400 })
    }

    const competitor = await prisma.competitor.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        tags: tags || '',
      },
    })

    return NextResponse.json(competitor, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
