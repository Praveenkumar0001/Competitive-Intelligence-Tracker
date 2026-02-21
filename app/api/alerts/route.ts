import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { competitorId, keyword } = body

    if (!competitorId || !keyword) {
      return NextResponse.json(
        { error: 'competitorId and keyword are required' },
        { status: 400 }
      )
    }

    const alert = await prisma.alert.create({
      data: {
        competitorId,
        keyword: keyword.trim(),
      },
    })

    return NextResponse.json(alert, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const alertId = searchParams.get('id')

    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 })
    }

    await prisma.alert.delete({
      where: { id: alertId },
    })

    return NextResponse.json({ message: 'Alert deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
