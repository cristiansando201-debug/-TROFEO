/**
 * TROFEO AI Provider Abstraction Layer
 * 
 * Unified interface for all AI providers.
 * Supports: OpenAI, Anthropic, Google Gemini, Ollama, vLLM, Demo
 * 
 * Usage:
 *   const ai = createAIProvider()
 *   const response = await ai.chat([{ role: 'user', content: 'Hello' }])
 */

export type AIMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type AIResponse = {
  content: string
  model: string
  provider: string
  tokens?: {
    prompt: number
    completion: number
    total: number
  }
}

export type StreamChunk = {
  content: string
  done: boolean
}

export type GenerationConfig = {
  temperature?: number
  maxTokens?: number
  topP?: number
  systemPrompt?: string
  mode?: string
}

export interface AIProvider {
  name: string
  model: string
  isDemo: boolean
  
  chat(messages: AIMessage[], config?: GenerationConfig): Promise<AIResponse>
  stream(messages: AIMessage[], config?: GenerationConfig): AsyncGenerator<StreamChunk>
  isAvailable(): Promise<boolean>
}
