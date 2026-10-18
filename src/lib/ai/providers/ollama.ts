/**
 * TROFEO — Ollama Local Provider
 * For running models locally via Ollama
 */

import type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from '../types'

const TROFEO_SYSTEM = `Eres TROFEO, una IA creadora avanzada. Tu filosofía: "Tu mundo, sin límites."
Cuando alguien te da una idea, la conviertes en un proyecto estructurado con creatividad y detalle.
Usas Markdown para dar formato a tus respuestas. Respondes en el idioma del usuario.`

export class OllamaProvider implements AIProvider {
  private baseUrl: string
  name = 'Ollama (Local)'
  model: string
  isDemo = false

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL ?? 'llama3.2'
  }

  async chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemMsg },
          ...messages
        ],
        stream: false,
        options: {
          temperature: config?.temperature ?? 0.8,
          num_predict: config?.maxTokens ?? 4096,
        }
      })
    })

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`)
    
    const data = await response.json()
    return {
      content: data.message?.content ?? '',
      model: this.model,
      provider: this.name,
    }
  }

  async *stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: 'system', content: systemMsg },
          ...messages
        ],
        stream: true,
        options: {
          temperature: config?.temperature ?? 0.8,
          num_predict: config?.maxTokens ?? 4096,
        }
      })
    })

    if (!response.ok || !response.body) throw new Error(`Ollama stream error`)

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const lines = decoder.decode(value).split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          const content = data.message?.content ?? ''
          const isDone = data.done ?? false
          yield { content, done: isDone }
        } catch { /* skip malformed chunks */ }
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) })
      return response.ok
    } catch {
      return false
    }
  }
}
