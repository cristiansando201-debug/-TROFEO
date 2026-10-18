/**
 * TROFEO — Anthropic Provider
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from '../types'

const TROFEO_SYSTEM = `Eres TROFEO, una IA creadora avanzada. Tu filosofía: "Tu mundo, sin límites."
Cuando alguien te da una idea, la conviertes en un proyecto estructurado con creatividad y detalle.
Usas Markdown para dar formato a tus respuestas. Respondes en el idioma del usuario.`

export class AnthropicProvider implements AIProvider {
  private client: Anthropic
  name = 'Anthropic'
  model: string
  isDemo = false

  constructor() {
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    this.model = process.env.ANTHROPIC_MODEL ?? 'claude-3-5-sonnet-20241022'
  }

  async chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const response = await this.client.messages.create({
      model: this.model,
      system: systemMsg,
      messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      temperature: config?.temperature ?? 0.8,
      max_tokens: config?.maxTokens ?? 4096,
    })

    const content = response.content[0]?.type === 'text' ? response.content[0].text : ''
    return {
      content,
      model: this.model,
      provider: this.name,
      tokens: {
        prompt: response.usage.input_tokens,
        completion: response.usage.output_tokens,
        total: response.usage.input_tokens + response.usage.output_tokens,
      }
    }
  }

  async *stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const stream = await this.client.messages.stream({
      model: this.model,
      system: systemMsg,
      messages: messages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      temperature: config?.temperature ?? 0.8,
      max_tokens: config?.maxTokens ?? 4096,
    })

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        yield { content: chunk.delta.text, done: false }
      }
    }
    yield { content: '', done: true }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.client.models.list()
      return true
    } catch {
      return false
    }
  }
}
