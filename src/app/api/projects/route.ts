/**
 * TROFEO — Projects API
 * GET  /api/projects    — list user projects
 * POST /api/projects    — create project
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id, status: { not: 'ARCHIVED' } },
    orderBy: { updatedAt: 'desc' },
    include: {
      _count: { select: { conversations: true, files: true } }
    }
  })

  return NextResponse.json({ projects })
}

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  type: z.enum(['GENERAL', 'GAME', 'SERIES', 'SOCIAL', 'ECOMMERCE', 'BUSINESS']).default('GENERAL'),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = createProjectSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      ...parsed.data,
    }
  })

  return NextResponse.json({ project }, { status: 201 })
}
