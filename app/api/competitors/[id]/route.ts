import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const competitor = await prisma.competitor.findUnique({
      where: { id: params.id },
      include: {
        links: {
          include: {
            checks: {
              orderBy: { checkDate: 'desc' },
              take: 5,
              include: {
                changes: true,
              },
            },
          },
        },
        alerts: true,
      },
    })

    if (!competitor) {
      return NextResponse.json({ error: 'Competitor not found' }, { status: 404 })
    }

    return NextResponse.json(competitor)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.competitor.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ message: 'Competitor deleted' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, tags } = body

    const competitor = await prisma.competitor.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags }),
      },
    })

    return NextResponse.json(competitor)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
