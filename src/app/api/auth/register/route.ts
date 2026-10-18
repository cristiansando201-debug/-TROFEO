/**
 * TROFEO — Register API
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos. Verifica nombre, email y contraseña (mín. 8 caracteres).' },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ya existe una cuenta con este email.' },
        { status: 409 }
      )
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 12)

    // Create user + default settings
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
        settings: { create: {} }
      },
      select: { id: true, name: true, email: true, plan: true }
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    console.error('[TROFEO Register]', err)
    return NextResponse.json(
      { error: 'No se pudo crear la cuenta. Inténtalo nuevamente.' },
      { status: 500 }
    )
  }
}
