import { useState, useRef, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Send, Loader2, Trash2, Bot, User } from 'lucide-react'
import { toast } from 'sonner'
import { sendChatMessage } from '../../lib/api/chat'
import type { ChatMessage, ChatRequest } from '../../types/chat'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [provider, setProvider] = useState('')
  const [model, setModel] = useState('')
  const [temperature, setTemperature] = useState(0.7)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const mutation = useMutation({
    mutationFn: (data: ChatRequest) => sendChatMessage(data),
    onSuccess: (response, variables) => {
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.data.text,
        usage: response.data.usage,
        timestamp: Date.now(),
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: variables.message,
          timestamp: Date.now(),
        },
        assistantMsg,
      ])
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Failed to send message'
      toast.error(message)
    },
  })

  const handleSend = () => {
    if (!input.trim()) return
    const payload: ChatRequest = {
      message: input.trim(),
    }
    if (provider.trim()) payload.provider = provider.trim()
    if (model.trim()) payload.model = model.trim()
    payload.temperature = temperature
    mutation.mutate(payload)
    setInput('')
  }

  const handleClear = () => {
    setMessages([])
    toast.info('Chat cleared')
  }

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">Chat Playground</h2>
          <p className="text-muted-foreground mt-1">Test AI models directly.</p>
        </div>
        <button
          onClick={handleClear}
          className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
        >
          <Trash2 size={16} />
          Clear chat
        </button>
      </div>

      {/* Optional provider/model controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Provider (e.g., openrouter)"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Model (e.g., google/gemma-2-9b-it:free)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Temp: {temperature}</label>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto rounded-lg border bg-white p-4 shadow-sm mb-4">
        {messages.length === 0 && !mutation.isPending && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Send a message to start.
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 mb-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <Bot size={16} className="text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {msg.usage && (
                <div className="mt-1 text-xs text-gray-500">
                  Tokens: {msg.usage.totalTokens} (prompt: {msg.usage.promptTokens}, completion: {msg.usage.completionTokens})
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex gap-3 mb-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2">
              <Loader2 size={16} className="animate-spin text-gray-500" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
          disabled={mutation.isPending}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || mutation.isPending}
          className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1"
        >
          {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          Send
        </button>
      </div>
    </div>
  )
}