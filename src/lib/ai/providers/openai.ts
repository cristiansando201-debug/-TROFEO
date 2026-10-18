/**
 * TROFEO — OpenAI Provider
 */

import OpenAI from 'openai'
import type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from '../types'

const TROFEO_SYSTEM = `Eres TROFEO, una IA creadora avanzada. Tu filosofía: "Tu mundo, sin límites." 
Cuando alguien te da una idea, la conviertes en un proyecto estructurado con creatividad y detalle.
Usas Markdown para dar formato a tus respuestas. Respondes en el idioma del usuario.`

export class OpenAIProvider implements AIProvider {
  private client: OpenAI
  name = 'OpenAI'
  model: string
  isDemo = false

  constructor() {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o'
  }

  async chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemMsg },
        ...messages
      ],
      temperature: config?.temperature ?? 0.8,
      max_tokens: config?.maxTokens ?? 4096,
    })

    const content = response.choices[0]?.message?.content ?? ''
    return {
      content,
      model: this.model,
      provider: this.name,
      tokens: {
        prompt: response.usage?.prompt_tokens ?? 0,
        completion: response.usage?.completion_tokens ?? 0,
        total: response.usage?.total_tokens ?? 0,
      }
    }
  }

  async *stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemMsg },
        ...messages
      ],
      temperature: config?.temperature ?? 0.8,
      max_tokens: config?.maxTokens ?? 4096,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content ?? ''
      const done = chunk.choices[0]?.finish_reason === 'stop'
      yield { content, done }
    }
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
