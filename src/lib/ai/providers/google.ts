/**
 * TROFEO — Google Gemini Provider
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from '../types'

const TROFEO_SYSTEM = `Eres TROFEO, una IA creadora avanzada. Tu filosofía: "Tu mundo, sin límites."
Cuando alguien te da una idea, la conviertes en un proyecto estructurado con creatividad y detalle.
Usas Markdown para dar formato a tus respuestas. Respondes en el idioma del usuario.`

export class GoogleProvider implements AIProvider {
  private client: GoogleGenerativeAI
  name = 'Google Gemini'
  model: string
  isDemo = false

  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? '')
    this.model = process.env.GOOGLE_MODEL ?? 'gemini-1.5-pro'
  }

  async chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    const genModel = this.client.getGenerativeModel({ 
      model: this.model,
      systemInstruction: systemMsg
    })

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = genModel.startChat({ history })
    const lastMsg = messages[messages.length - 1]?.content ?? ''
    
    const response = await chat.sendMessage(lastMsg)
    const content = response.response.text()

    return {
      content,
      model: this.model,
      provider: this.name,
    }
  }

  async *stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk> {
    const systemMsg = config?.systemPrompt ?? TROFEO_SYSTEM
    const genModel = this.client.getGenerativeModel({
      model: this.model,
      systemInstruction: systemMsg
    })

    const history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const chat = genModel.startChat({ history })
    const lastMsg = messages[messages.length - 1]?.content ?? ''
    
    const stream = await chat.sendMessageStream(lastMsg)
    
    for await (const chunk of stream.stream) {
      const text = chunk.text()
      yield { content: text, done: false }
    }
    yield { content: '', done: true }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const models = this.client.getGenerativeModel({ model: this.model })
      return !!models
    } catch {
      return false
    }
  }
}
