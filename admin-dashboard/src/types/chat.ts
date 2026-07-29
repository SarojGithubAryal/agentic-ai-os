export interface ChatRequest {
  message: string
  provider?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface ChatUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
}

export interface ChatResponse {
  success: boolean
  data: {
    text: string
    usage?: ChatUsage
  }
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  usage?: ChatUsage
  timestamp: number
}