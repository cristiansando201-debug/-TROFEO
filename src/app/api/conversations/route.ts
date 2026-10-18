/**
 * TROFEO — Conversations API
 * GET  /api/conversations        — list user conversations
 * POST /api/conversations        — create new conversation
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100)
  const cursor = searchParams.get('cursor')

  const conversations = await prisma.conversation.findMany({
    where: { userId: session.user.id, archived: false },
    orderBy: { updatedAt: 'desc' },
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    select: {
      id: true,
      title: true,
      mode: true,
      pinned: true,
      updatedAt: true,
      _count: { select: { messages: true } }
    }
  })

  return NextResponse.json({ conversations })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const schema = z.object({
    title: z.string().default('Nueva conversación'),
    mode: z.enum(['GENERAL', 'GAMES', 'STUDIO', 'SOCIAL', 'ECOMMERCE', 'SEARCH', 'BUSINESS']).default('GENERAL'),
  })

  const body = await req.json().catch(() => ({}))
  const parsed = schema.parse(body)

  const conversation = await prisma.conversation.create({
    data: {
      userId: session.user.id,
      title: parsed.title,
      mode: parsed.mode as any,
    }
  })

  return NextResponse.json({ conversation }, { status: 201 })
}
