/**
 * TROFEO — AI Factory
 * Central factory that selects the correct provider based on environment.
 */

import type { AIProvider } from './types'
import { DemoProvider } from './providers/demo'

let _provider: AIProvider | null = null

export function createAIProvider(): AIProvider {
  // Return cached instance
  if (_provider) return _provider

  const providerName = process.env.AI_PROVIDER ?? 'demo'

  switch (providerName.toLowerCase()) {
    case 'openai': {
      const { OpenAIProvider } = require('./providers/openai')
      _provider = new OpenAIProvider()
      break
    }
    case 'anthropic': {
      const { AnthropicProvider } = require('./providers/anthropic')
      _provider = new AnthropicProvider()
      break
    }
    case 'google': {
      const { GoogleProvider } = require('./providers/google')
      _provider = new GoogleProvider()
      break
    }
    case 'ollama': {
      const { OllamaProvider } = require('./providers/ollama')
      _provider = new OllamaProvider()
      break
    }
    default:
      _provider = new DemoProvider()
  }

  return _provider!
}

export function getProviderInfo() {
  const providerName = process.env.AI_PROVIDER ?? 'demo'
  const isDemo = providerName === 'demo'

  return {
    provider: providerName,
    isDemo,
    model: isDemo ? 'TROFEO Demo' : (process.env[`${providerName.toUpperCase()}_MODEL`] ?? 'unknown'),
  }
}

// Re-export types
export type { AIProvider, AIMessage, AIResponse, StreamChunk, GenerationConfig } from './types'
