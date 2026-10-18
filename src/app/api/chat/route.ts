/**
 * TROFEO — Chat API Route
 * POST /api/chat
 * Supports streaming SSE responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/redis'
import { createAIProvider } from '@/lib/ai'
import { z } from 'zod'

const chatSchema = z.object({
  message: z.string().min(1).max(10000),
  conversationId: z.string().optional(),
  mode: z.enum(['GENERAL', 'GAMES', 'STUDIO', 'SOCIAL', 'ECOMMERCE', 'SEARCH', 'BUSINESS']).default('GENERAL'),
  stream: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const userId = session.user.id
    const plan = session.user.plan ?? 'FREE'

    // Rate limiting
    const rateCheck = await checkRateLimit(userId, plan)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Límite de mensajes alcanzado. Actualiza tu plan para continuar.' },
        { status: 429 }
      )
    }

    // Parse & validate body
    const body = await req.json()
    const parsed = chatSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
    }

    const { message, conversationId, mode, stream } = parsed.data

    // Get or create conversation
    let conversation = conversationId
      ? await prisma.conversation.findFirst({
          where: { id: conversationId, userId },
          include: { messages: { orderBy: { createdAt: 'asc' }, take: 50 } }
        })
      : null

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          userId,
          mode: mode as any,
          title: message.slice(0, 60),
          messages: { create: { role: 'USER', content: message } }
        },
        include: { messages: { orderBy: { createdAt: 'asc' } } }
      })
    } else {
      await prisma.message.create({
        data: { conversationId: conversation.id, role: 'USER', content: message }
      })
    }

    // Build message history for AI
    const history = (conversation.messages ?? []).map(m => ({
      role: m.role === 'USER' ? 'user' as const : 'assistant' as const,
      content: m.content
    }))

    // Add current message if not already in history
    if (!history.find(m => m.role === 'user' && m.content === message)) {
      history.push({ role: 'user', content: message })
    }

    const ai = createAIProvider()

    // ─── Streaming response ───────────────────────────────────────
    if (stream) {
      const encoder = new TextEncoder()
      let fullContent = ''

      const readable = new ReadableStream({
        async start(controller) {
          try {
            // Send metadata first
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'meta', conversationId: conversation!.id, isDemo: ai.isDemo })}\n\n`
            ))

            for await (const chunk of ai.stream(history, { mode })) {
              fullContent += chunk.content
              controller.enqueue(encoder.encode(
                `data: ${JSON.stringify({ type: 'chunk', content: chunk.content, done: chunk.done })}\n\n`
              ))

              if (chunk.done) break
            }

            // Save assistant message to DB
            await prisma.message.create({
              data: {
                conversationId: conversation!.id,
                role: 'ASSISTANT',
                content: fullContent,
                metadata: { provider: ai.name, model: ai.model }
              }
            })

            // Update conversation title if first message
            if (conversation!.title === message.slice(0, 60) || conversation!.title === 'Nueva conversación') {
              await prisma.conversation.update({
                where: { id: conversation!.id },
                data: { title: message.slice(0, 60) }
              })
            }

            controller.enqueue(encoder.encode(`data: [DONE]\n\n`))
            controller.close()
          } catch (err) {
            console.error('[TROFEO Chat Stream Error]', err)
            controller.enqueue(encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: 'TROFEO no pudo completar la respuesta.' })}\n\n`
            ))
            controller.close()
          }
        }
      })

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Conversation-Id': conversation.id,
        }
      })
    }

    // ─── Non-streaming response ───────────────────────────────────
    const response = await ai.chat(history, { mode })

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: response.content,
        metadata: { provider: ai.name, model: ai.model, tokens: response.tokens }
      }
    })

    return NextResponse.json({
      content: response.content,
      conversationId: conversation.id,
      isDemo: ai.isDemo,
      provider: ai.name,
      model: ai.model,
    })

  } catch (err) {
    console.error('[TROFEO Chat API Error]', err)
    return NextResponse.json(
      { error: 'Algo salió mal. TROFEO no pudo completar esta generación.' },
      { status: 500 }
    )
  }
}
